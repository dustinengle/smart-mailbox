package client

import (
	"fmt"
)

type Total struct {
	Balance   string `json:"balance"`
	Device    string `json:"deviceId"`
	PublicKey string `json:"publickey"`
}

func (t Total) String() (s string) {
	s = fmt.Sprintf(
		"Balance: %s\tDevice: %s\tPublic: %s\n",
		t.Balance, t.Device, t.PublicKey,
	)
	return
}

type DeviceTotal []Total

type Token struct {
	Token string `json:"token"`
}

func (t Token) String() (s string) {
	s = fmt.Sprintf("Token: %s\n", t.Token)
	return
}

type User struct {
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

func (u User) String() (s string) {
	s = fmt.Sprintf("Email: %s\tPassword: %s\n", u.Email, u.Password)
	return
}

func UserBalance(token, email string) (res string, err error) {
	data := &User{Email: email}
	url := URL(PostBalance)
	res, err = PostText(url, token, data)
	return
}

func UserDeviceTotals(token, email string) (res DeviceTotal, err error) {
	res = *new(DeviceTotal)
	data := &User{Email: email}
	url := URL(PostDeviceTotal)
	err = Post(url, token, data, &res)
	return
}

func UserLogin(email, password string) (res Token, err error) {
	res = *new(Token)
	data := &User{Email: email, Password: password}
	url := URL(PostLogin)
	err = Post(url, "", data, &res)
	return
}

func UserRegister(email, password string) (err error) {
	data := &User{Email: email, Password: password}
	url := URL(PostUser)
	err = Post(url, "", data, nil)
	return
}
