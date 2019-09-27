package client

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/ddliu/go-httpclient"
)

var (
	client *httpclient.HttpClient
	host   string
)

func url(route string) string {
	return fmt.Sprintf("%s%s", host, route)
}

func Get(route, token string, body interface{}) (err error) {
	var res *httpclient.Response
	if res, err = client.Begin().WithHeader("Authorization", token).Get(url(route)); err != nil {
		return
	}
	buf := make([]byte, 0)
	if buf, err = res.ReadAll(); err != nil {
		return
	}
	r := bytes.NewReader(buf)
	err = json.NewDecoder(r).Decode(body)
	return
}

func Post(route, token string, data, body interface{}) (err error) {
	var res *httpclient.Response
	if res, err = client.Begin().WithHeader("Authorization", token).Post(url(route), data); err != nil {
		return
	}
	buf := make([]byte, 0)
	if buf, err = res.ReadAll(); err != nil {
		return
	}
	r := bytes.NewReader(buf)
	err = json.NewDecoder(r).Decode(body)
	return
}

func Put(route, token string, data, body interface{}) (err error) {
	w := new(bytes.Buffer)
	if err = json.NewEncoder(w).Encode(data); err != nil {
		return
	}

	var res *httpclient.Response
	if res, err = client.Begin().WithHeader("Authorization", token).Put(url(route), w); err != nil {
		return
	}
	buf := make([]byte, 0)
	if buf, err = res.ReadAll(); err != nil {
		return
	}
	r := bytes.NewReader(buf)
	err = json.NewDecoder(r).Decode(body)
	return
}

func Setup(addr string) {
	client = httpclient.NewHttpClient()
	host = addr
	client.Defaults(httpclient.Map{
		httpclient.OPT_USERAGENT: "SafeBox API v1.0.0",
		"Accept":                 "application/json",
		"Content-Type":           "application/json",
	})
}
