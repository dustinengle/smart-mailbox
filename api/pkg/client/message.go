package client

import "fmt"

type Message struct {
	Channel     string  `json:"channel"`
	Name        string  `json:"name"`
	Protocol    string  `json:"protocol"`
	Publisher   string  `json:"publisher"`
	StringValue string  `json:"stringValue,omitempty"`
	Time        uint64  `json:"time"`
	Unit        string  `json:"unit"`
	Value       float64 `json:"value,omitempty"`
}

func (m Message) String() (s string) {
	vs := m.StringValue
	if len(vs) > 10 {
		vs = fmt.Sprintf("%s...", vs[:10])
	}

	s = fmt.Sprintf(
		"Name: %s\tProto: %s\tUnit: %s\tV: %f\t VS: %s\n",
		m.Name, m.Protocol, m.Unit, m.Value, vs,
	)
	return
}

type Messages struct {
	Messages []Message `json:"messages"`
}
