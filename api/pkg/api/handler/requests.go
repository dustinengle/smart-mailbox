package handler

type Activate struct {
	Gateway string `binding:"required,alphanum,min=6" json:"gateway"`
}

type Login struct {
	Email    string `binding:"required,email" json:"email"`
	Google   bool   `binding:"omitempty" json:"google,omitempty"`
	Password string `binding:"required" json:"password"`
}

type Mailbox struct {
	AccountID uint   `binding:"required,min=1" json:"accountId"`
	Gateway   string `binding:"required,alphanum,min=6" json:"gateway"`
	Key       string `binding:"required" json:"key"`
	Name      string `binding:"required,min=3" json:"name"`
	PublicKey string `binding:"omitempty" json:"publicKey,omitempty"`
	SN        string `binding:"required,alphanum,min=6" json:"sn"`
}

type PIN struct {
	AccountID uint   `binding:"required,min=1" json:"accountId"`
	Email     string `binding:"omitempty,email" json:"email,omitempty"`
	MailboxID uint   `binding:"required,min=1" json:"mailboxId"`
	Name      string `binding:"required" json:"name"`
	Number    uint32 `binding:"required,min=0000,max=9999" json:"number"`
	Phone     string `binding:"omitempty,min=1111111111,max=9999999999" json:"phone,omitempty"`
	Single    bool   `binding:"" json:"single,omitempty"`
	Timeout   uint64 `binding:"omitempty,min=1" json:"timeout,omitempty"`
}

type Register struct {
	Email     string `binding:"required,email" json:"email"`
	Google    bool   `binding:"omitempty" json:"google,omitempty"`
	Name      string `binding:"required" json:"name"`
	Password  string `binding:"required" json:"password"`
	Phone     string `binding:"omitempty,min=1" json:"phone,omitempty"`
	PushToken string `binding:"omitempty" json:"pushToken,omitempty"`
}

type User struct {
	AccountID uint   `binding:"omitempty,min=1" json:"accountId,omitempty"`
	Email     string `binding:"required,email" json:"email"`
	Google    bool   `binding:"omitempty" json:"google,omitempty"`
	ID        uint   `binding:"omitempty,min=1" json:"id,omitempty"`
	Name      string `binding:"required" json:"name"`
	Phone     string `binding:"omitempty,min=1" json:"phone,omitempty"`
	PushToken string `binding:"omitempty" json:"pushToken,omitempty"`
}
