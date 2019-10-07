package reply

type Reply struct {
	Error  string      `json:"error,omitempty"`
	Result interface{} `json:"result,omitempty"`
}
