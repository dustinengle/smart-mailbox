package client

import "fmt"

type Thing struct {
	ID   string `json:"id,omitempty"`
	Key  string `json:"key,omitempty"`
	Meta string `json:"metadata,omitempty"`
	Name string `json:"name"`
	Type string `json:"type"`
}

func (t Thing) String() (s string) {
	s = fmt.Sprintf(
		"ID: %s\tKey: %s\tName: %s\tType: %s\n",
		t.ID, t.Key, t.Name, t.Type,
	)
	return
}

type Things struct {
	Limit  uint64  `json:"limit"`
	Offset uint64  `json:"offset"`
	Things []Thing `json:"things"`
	Total  uint64  `json:"total"`
}

func (ts Things) String() (s string) {
	s = fmt.Sprintf(
		"Limit: %d\tOffset: %d\tTotal: %d\n%s\n",
		ts.Limit, ts.Offset, ts.Total, ts.Things,
	)
	return
}

func ThingCreate(token, name, kind string) (err error) {
	data := &Thing{Name: name, Type: kind}
	url := URL(PostThing)
	err = Post(url, token, data, nil)
	return
}

func ThingRead(token string, limit, offset uint64) (res Things, err error) {
	res = *new(Things)
	url := fmt.Sprintf("%s?limit=%d&offset=%d", URL(GetThings), limit, offset)
	err = Get(url, token, &res)
	return
}
