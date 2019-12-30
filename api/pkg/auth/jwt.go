package auth

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var secret string

func CreateToken(userID, accountID uint) (token string, err error) {
	claims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(60 * 24 * time.Hour).UTC().Unix(), // 60 days
		Id:        fmt.Sprintf("%d", userID),
		Issuer:    "It's Here v0.1.0",
		Subject:   fmt.Sprintf("%d", accountID),
	}

	secret := []byte(os.Getenv("JWT_SECRET"))
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err = tok.SignedString(secret)
	return
}

func ExtractJWT(token string) (t *jwt.Token, c jwt.MapClaims, userID, accountID uint, err error) {
	validator := func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(secret), nil
	}

	if t, err = jwt.Parse(token, validator); err != nil {
		err = fmt.Errorf("unable to parse token string %v", err)
		return
	}

	c, ok := t.Claims.(jwt.MapClaims)
	if !ok {
		err = fmt.Errorf("claims not valid %v %v", c, t)
		return
	} else if !t.Valid {
		err = fmt.Errorf("token is not validate %v", t)
		return
	}

	aid, err := strconv.ParseUint(c["sub"].(string), 10, 64)
	if err != nil {
		err = fmt.Errorf("unable to get account id from claims")
		return
	}
	accountID = uint(aid)

	uid, err := strconv.ParseUint(c["jti"].(string), 10, 64)
	if err != nil {
		err = fmt.Errorf("unable to get user id from claims")
		return
	}
	userID = uint(uid)
	return
}

func SetSecret(s string) {
	secret = s
}
