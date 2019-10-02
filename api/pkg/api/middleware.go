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
	account := &account.Account{ID: c.MustGet("accountID").(uint)}
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
		reply.Error(c, fmt.Errorf("Unauthorized"), http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(auth, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		secret := []byte(os.Getenv("JWT_SECRET"))
		return secret, nil
	})
	if err != nil {
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.StandardClaims)
	if !ok {
		reply.Error(c, fmt.Errorf("claims not valid %v", claims), http.StatusUnauthorized)
		return
	} else if !token.Valid {
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	accountID, err := strconv.ParseUint(claims.Id, 10, 64)
	if err != nil {
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	userID, err := strconv.ParseUint(claims.Subject, 10, 64)
	if err != nil {
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
