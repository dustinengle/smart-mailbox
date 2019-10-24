package middleware

import (
	"fmt"
	"os"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/dustinengle/smart-mailbox/pkg/api/reply"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/model"
	"github.com/gin-gonic/gin"
)

func AccountToken(c *gin.Context) {
	account := &model.Account{
		ID: c.MustGet("accountID").(uint),
	}
	if err := db.Single(account); err != nil {
		reply.Unauthorized(c, err)
		return
	}

	c.Set("accountToken", account.Token)
	c.Next()
}

func Authorize(c *gin.Context) {
	auth := c.GetHeader("Authorization")
	if auth == "" {
		fmt.Println("authorization header empty")
		reply.Unauthorized(c, fmt.Errorf("Unauthorized"))
		return
	}

	token, err := jwt.Parse(auth, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		secret := []byte(os.Getenv("JWT_SECRET"))
		return secret, nil
	})
	if err != nil {
		fmt.Println("unable to parse token")
		reply.Unauthorized(c, err)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		reply.Unauthorized(c, fmt.Errorf("claims not valid %v %v", claims, token))
		return
	} else if !token.Valid {
		fmt.Println("token is not valid")
		reply.Unauthorized(c, err)
		return
	}

	aid, err := strconv.ParseUint(claims["sub"].(string), 10, 64)
	if err != nil {
		fmt.Println("unable to get account id from claims")
		reply.Unauthorized(c, err)
		return
	}
	accountID := uint(aid)

	uid, err := strconv.ParseUint(claims["jti"].(string), 10, 64)
	if err != nil {
		fmt.Println("unable to get user id from claims")
		reply.Unauthorized(c, err)
		return
	}
	userID := uint(uid)

	// Fetch the user from the database and make sure the tokens match.
	user := &model.User{
		AccountID: accountID,
		ID:        userID,
	}
	if err = db.Single(user); err != nil {
		fmt.Printf("unable to find user with matching id(%d) and account id(%d)\n", userID, accountID)
		reply.Unauthorized(c, err)
		return
	} else if user.Token == "" || user.Token != auth {
		fmt.Printf("tokens do not match: %s != %s\n", user.Token, auth)
		reply.Unauthorized(c, fmt.Errorf("invalid issued token"))
		return
	}

	c.Set("accountID", accountID)
	c.Set("userID", userID)
	c.Next()
}
