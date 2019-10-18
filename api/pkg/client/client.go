package client

import (
	"bytes"
	"encoding/json"
	"io"
	"os"
	"strings"

	"github.com/ddliu/go-httpclient"
)

var (
	client *httpclient.HttpClient
)

func init() {
	client = httpclient.NewHttpClient()
	client.Defaults(httpclient.Map{
		httpclient.OPT_DEBUG:     os.Getenv("DEBUG") != "",
		httpclient.OPT_USERAGENT: "It's Here API v0.1.0",
		"Accept":                 "application/json",
		"Content-Type":           "application/json",
	})
}

func Get(url, token string, body interface{}) (err error) {
	var res *httpclient.Response
	if res, err = client.Begin().WithHeader("Authorization", token).Get(url); err != nil {
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

func Post(url, token string, data, body interface{}) (err error) {
	cli := client
	if token != "" {
		cli = client.WithHeader("Authorization", token)
	}

	var res *httpclient.Response
	if res, err = cli.Begin().PostJson(url, data); err != nil && err != io.EOF {
		return
	}
	if body != nil {
		contentType := res.Header.Get("Content-Type")
		if strings.Contains(contentType, "text/html") {
			body, err = res.ToString()
		} else {
			buf := make([]byte, 0)
			if buf, err = res.ReadAll(); err != nil {
				return
			}
			r := bytes.NewReader(buf)
			err = json.NewDecoder(r).Decode(body)
		}
	}
	return
}

func PostSenML(url, token string, data, body interface{}) (err error) {
	cli := client
	cli = cli.WithHeader("Authorization", token)
	cli = cli.WithHeader("Content-Type", "application/senml+json")

	var res *httpclient.Response
	if res, err = cli.Begin().PostJson(url, data); err != nil && err != io.EOF {
		return
	}
	if body != nil {
		buf := make([]byte, 0)
		if buf, err = res.ReadAll(); err != nil {
			return
		}
		r := bytes.NewReader(buf)
		err = json.NewDecoder(r).Decode(body)
	}
	return
}

func PostText(url, token string, data interface{}) (body string, err error) {
	cli := client.WithHeader("Authorization", token)

	var res *httpclient.Response
	if res, err = cli.Begin().PostJson(url, data); err != nil && err != io.EOF {
		return
	}
	body, err = res.ToString()
	return
}

func Put(url, token string, data, body interface{}) (err error) {
	w := new(bytes.Buffer)
	if data != nil {
		if err = json.NewEncoder(w).Encode(data); err != nil {
			return
		}
	}

	var res *httpclient.Response
	cli := client.Begin().WithHeader("Authorization", token)
	if res, err = cli.Put(url, w); err != nil && err != io.EOF {
		return
	}
	if body != nil {
		buf := make([]byte, 0)
		if buf, err = res.ReadAll(); err != nil {
			return
		}
		r := bytes.NewReader(buf)
		err = json.NewDecoder(r).Decode(body)
	}
	return
}
