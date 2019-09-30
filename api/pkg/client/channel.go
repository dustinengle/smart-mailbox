package client

import "fmt"

type Channel struct {
	ID   string `json:"id,omitempty"`
	Meta string `json:"metadata,omitempty"`
	Name string `json:"name"`
}

func (ch Channel) String() (s string) {
	s = fmt.Sprintf("ID: %s\tName: %s\tMeta: %s\n", ch.ID, ch.Name, ch.Meta)
	return
}

type Channels struct {
	Channels []Channel `json:"channels"`
	Limit    uint64    `json:"limit"`
	Offset   uint64    `json:"offset"`
	Total    uint64    `json:"total"`
}

func (chs Channels) String() (s string) {
	s = fmt.Sprintf(
		"Limit: %d\tOffset: %d\tTotal: %d\n%s\n",
		chs.Limit, chs.Offset, chs.Total, chs.Channels,
	)
	return
}

func ChannelConnect(token, channelID, thingID string) (err error) {
	url := URL(PutConnect, channelID, thingID)
	err = Put(url, token, nil, nil)
	return
}

func ChannelCreate(token, name string) (err error) {
	data := &Channel{Name: name}
	url := URL(PostChannel)
	err = Post(url, token, data, nil)
	return
}

func ChannelRead(token string, limit, offset uint64) (res Channels, err error) {
	res = *new(Channels)
	url := fmt.Sprintf("%s?limit=%d&offset=%d", URL(GetChannels), limit, offset)
	err = Get(url, token, &res)
	return
}

func ChannelMessageCreate(token, channelID string, data interface{}) (err error) {
	url := URL(PostChannelMessage, channelID)
	err = PostSenML(url, token, data, nil)
	return
}

func ChannelMessageRead(token, channelID string, limit uint64) (res Messages, err error) {
	res = *new(Messages)
	url := fmt.Sprintf("%s?limit=%d", URL(GetChannelMessages, channelID), limit)
	err = Get(url, token, &res)
	return
}

func ChannelThingRead(token, channelID string, limit uint64) (res Things, err error) {
	res = *new(Things)
	url := fmt.Sprintf("%s?limit=%d", URL(GetChannelThings, channelID), limit)
	err = Get(url, token, &res)
	return
}
