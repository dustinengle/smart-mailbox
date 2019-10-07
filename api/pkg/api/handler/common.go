package handler

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	uuid "github.com/satori/go.uuid"
)

func createToken(id, accountID uint) (token string, err error) {
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(30 * 24 * time.Hour).UTC().Unix(), // 30 days
		Id:        fmt.Sprintf("%d", id),
		Issuer:    "SafeBox v0.1.0",
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
