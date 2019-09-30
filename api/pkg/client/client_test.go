package client

import (
	"testing"
)

const (
	TestEmail    = "dustin.engle@pagarba.io"
	TestPassword = "Password!1"
)

var token string

func TestUserLogin(t *testing.T) {
	body := new(Token)
	data := User{TestEmail, TestPassword}
	url := URL(PostLogin)
	if err := Post(url, token, data, body); err != nil {
		t.Error(err)
	}
	t.Log(body)
	token = body.Token
}

func TestChannelCreate(t *testing.T) {
	data := &Channel{Name: "Testing Channel Run"}
	url := URL(PostChannel)
	if err := Post(url, token, data, nil); err != nil {
		t.Error(err)
	}
}

func TestChannels(t *testing.T) {
	body := new(Channels)
	url := URL(GetChannels)
	if err := Get(url, token, body); err != nil {
		t.Error(err)
	}
	t.Log(body)
}

func TestThings(t *testing.T) {
	body := new(Things)
	url := URL(GetThings)
	if err := Get(url, token, body); err != nil {
		t.Error(err)
	}
	t.Log(body)
}
