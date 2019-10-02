package user

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func createToken(id, accountID uint) (token string, err error) {
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour).UTC().Unix(), // 30 days
		Id:        fmt.Sprintf("%d", id),
		Issuer:    "SafeBox v1.0.0",
		Subject:   fmt.Sprintf("%d", accountID),
	}

	secret := []byte(os.Getenv("JWT_SECRET"))
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err = tok.SignedString(secret)
	return
}

func UUIDv4() (s string) {
	s = uuid.NewV4().String()
	return
}

func DeleteUser(c *gin.Context) {
	reply.Error(c, fmt.Errorf("Forbidden"), http.StatusForbidden)
}

func GetUser(c *gin.Context) {
	user := &User{ID: c.MustGet("userID").(uint)}
	if err := c.BindJSON(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, user)
}

func PostLogin(c *gin.Context) {
	user := new(User)
	if err := c.BindJSON(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Single(user); err != nil {
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	token, err := createToken(user.ID, user.AccountID)
	if err != nil {
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	reply.OK(c, token)
}

func PostOAuth(c *gin.Context) {
	// Handle OAuth2 flow for Google.

	reply.OK(c, gin.H{"OK": "PostOAuth"})
}

func PostUser(c *gin.Context) {
	user := new(User)
	if err := c.BindJSON(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Create(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, user)
}

func PutUser(c *gin.Context) {
	user := new(User)
	if err := c.BindJSON(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Save(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, user)
}
