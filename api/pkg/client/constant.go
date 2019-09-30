package client

import (
	"fmt"
	"strings"
)

const (
	// Host is the StreamIOT host address for requests.
	Host = "https://streamiot.dev"
)

// Routes
const (
	// Get => {id, metadata, name}
	GetChannel = "/channels/$1"
	// Get ?limit&offset => {total, offset, limit, channels}
	GetChannels = "/channels"
	// Get ?limit => {messages}
	//    * Should use `thing.key` as Authorization header
	GetChannelMessages = "/reader/channels/$1/messages"
	// Get ?limit&offset => {total, offset, limit, things}
	GetChannelThings = "/channels/$1/things"
	// Get ?limit&offset => {total, offset, limit, things}
	GetThings = "/things"
	// Post {email} => {PUBLIC_KEY: balance}
	PostBalance = "/api/returnbalance"
	// Post {name} => 201 Empty
	PostChannel = "/channels"
	// Post [SenML] => 202 Empty
	//    * Should use `thing.key` as Authorization header
	PostChannelMessage = "/http/channels/$1/messages"
	// Put => 200 Empty
	PutConnect = "/channels/$1/things/$2"
	// Post {email, deviceId} => {PUBLIC_KEY: balance}
	PostDeviceBalance = "/api/devicebalance"
	// Post {email} => []
	PostDeviceTotal = "/api/devicetotal"
	// Post {email, password} => {token: JWT}
	PostLogin = "/tokens"
	// Post {name, type=(app|device)} => 201 Empty
	PostThing = "/things"
	// Post
	PostUser = "/api/trigxaccount"
)

// URL will replace identifiers will the supplied value.
// Can handle up to two identifiers that should follow:
//    $1 = channel id
//    $2 = thing id
func URL(route string, opts ...string) (s string) {
	size := len(opts)
	if size >= 1 {
		if strings.Contains(route, "$1") {
			route = strings.Replace(route, "$1", opts[0], 1)
		}
		if size >= 2 && strings.Contains(route, "$2") {
			route = strings.Replace(route, "$2", opts[1], 1)
		}
	}
	s = fmt.Sprintf("%s%s", Host, route)
	return
}
