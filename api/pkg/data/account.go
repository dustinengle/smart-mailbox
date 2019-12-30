package data

import (
	"fmt"
	"time"

	"github.com/dustinengle/itshere/pkg/client"

	"github.com/dustinengle/itshere/pkg/auth"
)

type Account struct {
	CreatedAt time.Time `gorm:"" json:"createdAt"`
	Email     string    `gorm:"unique" json:"email"`
	Gateways  []Gateway `gorm:"" json:"gateways"`
	ID        uint      `gorm:"primary_key" json:"id,omitempty"`
	Mailboxes []Mailbox `gorm:"" json:"mailboxes"`
	Password  string    `gorm:"" json:"-"`
	PublicKey string    `gorm:"" json:"publicKey,omitempty"`
	Token     string    `gorm:"" json:"-"`
	UpdatedAt time.Time `gorm:"" json:"updatedAt,omitempty"`
	Users     []User    `gorm:"" json:"users"`
}

func NewAccount(email, password string) (a *Account, err error) {
	a = &Account{
		Email:     email,
		Gateways:  make([]Gateway, 0),
		Mailboxes: make([]Mailbox, 0),
		Password:  password,
		Users:     make([]User, 0),
	}

	// Create the account on StreamIoT.
	if err = client.UserRegister(a.Email, a.Password); err != nil {
		return
	}

	// Sleep to allow for StreamIoT to process the new account.
	time.Sleep(1 * time.Second)

	// Login to StreamIoT and get the token for storage in the account.
	var iottoken client.Token
	if iottoken, err = client.UserLogin(a.Email, a.Password); err != nil {
		return
	}
	a.Token = iottoken.Token

	// Hash the account password before storage.
	if err = a.HashPassword(); err != nil {
		return
	}

	err = Create(a)
	return
}

func (a *Account) Balance() (b string, err error) {
	if b, err = client.UserBalance(a.Token, a.Email); err != nil {
		return
	}

	fmt.Printf("BALANCE: %s\n", b)
	return
}

func (a *Account) ComparePasswords(password string) (err error) {
	err = auth.ComparePasswords(a.Password, password)
	return
}

func (a *Account) CreateGateway(name, publicKey string) (g *Gateway, err error) {
	g = &Gateway{
		PublicKey: publicKey,
	}

	// Verify that there are no other gateways with this name.
	if err = Single(g); err == nil {
		fmt.Println(err)
		err = fmt.Errorf("there is already a gateway with this public key %s", g.PublicKey)
		return
	}
	g.AccountID = a.ID
	g.Name = name

	// Login again.
	if err = a.Login(); err != nil {
		return
	}

	// Create the thing on StreamIoT.
	meta := fmt.Sprintf("{\"pk\":\"%s\"}", g.PublicKey)
	if err = client.ThingCreate(a.Token, g.Name, "device", meta); err != nil {
		return
	}
	fmt.Println("thing create:", meta)

	// Add a channel for the gateway/thing on StreamIoT.
	if err = client.ChannelCreate(a.Token, g.Name); err != nil {
		return
	}
	fmt.Println("channel create:", g)

	time.Sleep(2 * time.Second)

	// Get the thing id from StreamIoT.
	var things client.Things
	if things, err = client.ThingRead(a.Token, 1000, 0); err != nil {
		fmt.Println(err)
		return
	}
	for _, thing := range things.Things {
		if thing.Name == g.Name {
			g.DeviceID = thing.ID
			g.DeviceKey = thing.Key
			break
		}
	}
	fmt.Println("things:", things)

	// Get the channel id from StreamIoT.
	var channels client.Channels
	if channels, err = client.ChannelRead(a.Token, 1000, 0); err != nil {
		return
	}
	for _, channel := range channels.Channels {
		if channel.Name == g.Name {
			g.ChannelID = channel.ID
			break
		}
	}
	fmt.Println("channels:", channels)

	// Connect the thing and channel together.
	if err = client.ChannelConnect(a.Token, g.ChannelID, g.DeviceID); err != nil {
		return
	}

	err = Create(g)
	fmt.Println(err)
	return
}

func (a *Account) CreateUser(name, email, phone string) (u *User, err error) {
	u = &User{
		AccountID: a.ID,
		Email:     email,
		Name:      name,
		Phone:     phone,
	}

	err = Create(u)
	return
}

func (a *Account) Delete() (err error) {
	err = Delete(a)
	return
}

func (a *Account) HashPassword() (err error) {
	//a.Password, err = auth.HashPassword(a.Password)
	return
}

func (a *Account) Login() (err error) {
	var token client.Token
	if token, err = client.UserLogin(a.Email, a.Password); err != nil {
		return
	}

	a.Token = token.Token
	return
}

func (a *Account) Save() (err error) {
	if a.ID != 0 {
		err = Update(a)
	} else {
		err = Create(a)
	}
	return
}

func (a *Account) Totals() (t client.DeviceTotal, err error) {
	if t, err = client.UserDeviceTotals(a.Token, a.Email); err != nil {
		return
	}

	fmt.Printf("TOTALS: %s\n", t)
	return
}
