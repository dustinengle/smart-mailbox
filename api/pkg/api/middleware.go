package api

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/reply"

	"github.com/dgrijalva/jwt-go"
	"github.com/dustinengle/smart-mailbox/pkg/account"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func accountToken(c *gin.Context) {
	account := &account.Account{ID: uint(c.MustGet("accountID").(uint64))}
	if err := db.Single(account); err != nil {
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	c.Set("accountToken", account.Token)
	c.Next()
}

func authorize(c *gin.Context) {
	auth := c.GetHeader("Authorization")
	if auth == "" {
		fmt.Println("authorization header empty")
		reply.Error(c, fmt.Errorf("Unauthorized"), http.StatusUnauthorized)
		return
	}
	fmt.Println(auth)

	token, err := jwt.Parse(auth, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		secret := []byte(os.Getenv("JWT_SECRET"))
		return secret, nil
	})
	if err != nil {
		fmt.Println("unable to parse token")
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		reply.Error(c, fmt.Errorf("claims not valid %v %v", claims, token), http.StatusUnauthorized)
		return
	} else if !token.Valid {
		fmt.Println("token is not valid")
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	accountID, err := strconv.ParseUint(claims["jti"].(string), 10, 64)
	if err != nil {
		fmt.Println("unable to get account id from claims")
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	userID, err := strconv.ParseUint(claims["sub"].(string), 10, 64)
	if err != nil {
		fmt.Println("unable to get user id from claims")
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	c.Set("accountID", accountID)
	c.Set("userID", userID)
	c.Next()
}

func middleware(r *gin.Engine) {
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		//AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"DELETE", "GET", "OPTIONS", "PUT", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "Origin"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowAllOrigins:  true,
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
}
