package auth

import (
	"encoding/hex"

	"golang.org/x/crypto/bcrypt"
)

func ComparePasswords(hash, password string) (err error) {
	bhash := make([]byte, 0)
	if bhash, err = hex.DecodeString(hash); err != nil {
		return
	}

	err = bcrypt.CompareHashAndPassword(bhash, []byte(password))
	return
}

func HashPassword(password string) (hash string, err error) {
	bpass := []byte(password)
	hpass := make([]byte, 0)
	if hpass, err = bcrypt.GenerateFromPassword(bpass, bcrypt.DefaultCost); err != nil {
		return
	}
	hash = hex.EncodeToString(hpass)
	return
}
