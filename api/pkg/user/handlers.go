package user

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
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
	// Delete the currently logged in user from JWT.

	reply.OK(c, gin.H{"OK": "DeleteUser"})
}

func GetUser(c *gin.Context) {
	// Return the current logged in user.

	reply.OK(c, gin.H{"OK": "GetUser"})
}

func PostLogin(c *gin.Context) {
	// Attempt to login and return a token.

	reply.OK(c, gin.H{"OK": "PostLogin"})
}

func PostOAuth(c *gin.Context) {
	// Handle OAuth2 flow for Google.

	reply.OK(c, gin.H{"OK": "PostOAuth"})
}

func PostUser(c *gin.Context) {
	// Add a new user to an account.

	// Send the welcome email with mobile.

	reply.OK(c, gin.H{"OK": "PostUser"})
}

func PutUser(c *gin.Context) {
	// Update a user in an account.

	reply.OK(c, gin.H{"OK": "PutUser"})
}
