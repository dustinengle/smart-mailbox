package handler

type Activate struct {
	PublicKey string `binding:"required,alphanum,min=6" json:"publicKey"`
	//Signature string `binding:"required,alphanum,min=6" json:"signature"`
	Timestamp string `binding:"omitempty,min=1" json:"timestamp,omitempty"`
}

type Gateway struct {
	ID        uint   `binding:"omitempty,min=1" json:"id,omitempty"`
	Name      string `binding:"required,min=3" json:"name"`
	PublicKey string `binding:"required,min=6" json:"publicKey"`
	Timestamp uint32 `binding:"omitempty,min=1" json:"timestamp,omitempty"`
}

type IDs struct {
	GatewayID uint `binding:"omitempty,min=1" json:"gatewayId,omitempty"`
	ID        uint `binding:"required,min=1" json:"id"`
	MailboxID uint `binding:"omitempty,min=1" json:"mailboxId,omitempty"`
}

type Login struct {
	Email    string `binding:"required,email" json:"email"`
	Google   bool   `binding:"omitempty" json:"google,omitempty"`
	Password string `binding:"required" json:"password"`
}

type Mailbox struct {
	GatewayID uint   `binding:"required,min=1" json:"gatewayId"`
	ID        uint   `binding:"omitempty,min=1" json:"id,omitempty"`
	Name      string `binding:"required,min=3" json:"name"`
	PublicKey string `binding:"required,min=6" json:"publicKey"`
}

type Message struct {
	GatewayID uint                     `binding:"required,min=1" json:"gatewayId"`
	MailboxID uint                     `binding:"required,min=1" json:"mailboxId"`
	SenML     []map[string]interface{} `binding:"required" json:"senML"`
}

type PIN struct {
	Email     string `binding:"omitempty,email" json:"email,omitempty"`
	ID        uint   `binding:"omitempty,min=1" json:"id,omitempty"`
	MailboxID uint   `binding:"required,min=1" json:"mailboxId"`
	Name      string `binding:"required,min=1" json:"name"`
	Number    uint32 `binding:"required,min=0000,max=9999" json:"number"`
	Phone     string `binding:"omitempty,min=11,max=13" json:"phone,omitempty"`
	Single    bool   `binding:"" json:"single,omitempty"`
	Timeout   uint64 `binding:"omitempty,min=1" json:"timeout,omitempty"`
}

type Register struct {
	Email     string `binding:"required,email" json:"email"`
	Google    bool   `binding:"omitempty" json:"google,omitempty"`
	Name      string `binding:"required,min=1" json:"name"`
	Password  string `binding:"required,min=1" json:"password"`
	Phone     string `binding:"omitempty,min=1" json:"phone,omitempty"`
	PushToken string `binding:"omitempty" json:"pushToken,omitempty"`
}

type User struct {
	AccountID uint   `binding:"omitempty,min=1" json:"accountId,omitempty"`
	Email     string `binding:"required,email" json:"email"`
	Google    bool   `binding:"omitempty" json:"google,omitempty"`
	ID        uint   `binding:"omitempty,min=1" json:"id,omitempty"`
	Name      string `binding:"required,min=1" json:"name"`
	Phone     string `binding:"omitempty,min=1" json:"phone,omitempty"`
	PushToken string `binding:"omitempty" json:"pushToken,omitempty"`
}
