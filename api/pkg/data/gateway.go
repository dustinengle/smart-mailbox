package data

import (
	"fmt"
	"time"

	"github.com/dustinengle/itshere/pkg/client"
)

type Gateway struct {
	AccountID   uint      `gorm:"" json:"accountId"`
	ActivatedAt time.Time `gorm:"" json:"activatedAt"`
	Address     string    `gorm:"" json:"address"`
	ChannelID   string    `gorm:"" json:"channelId"`
	CreatedAt   time.Time `gorm:"" json:"createdAt"`
	DeviceID    string    `gorm:"" json:"deviceId"`
	DeviceKey   string    `gorm:"" json:"deviceKey"`
	ID          uint      `gorm:"primary_key" json:"id,omitempty"`
	Mailboxes   []Mailbox `gorm:"" json:"mailboxes"`
	Name        string    `gorm:"" json:"name"`
	PublicKey   string    `gorm:"unique" json:"publicKey"`
	UpdatedAt   time.Time `gorm:"" json:"updatedAt,omitempty"`
}

func (g *Gateway) CreateMailbox(m *Mailbox) (err error) {
	m.AccountID = g.AccountID
	m.GatewayID = g.ID

	// Load the account from the database.
	a := &Account{
		ID: g.AccountID,
	}
	if err = Single(a); err != nil {
		return
	}
	fmt.Println("a:", a)

	// Login again.
	if err = a.Login(); err != nil {
		return
	}

	// Create the new mailbox channel on StreamIoT.
	if err = client.ChannelCreate(a.Token, m.Name); err != nil {
		return
	}
	fmt.Println("channel created")

	time.Sleep(2 * time.Second)

	// Get the channel id from StreamIoT.
	var channels client.Channels
	if channels, err = client.ChannelRead(a.Token, 1000, 0); err != nil {
		return
	}
	fmt.Println("channels:", channels)
	for _, channel := range channels.Channels {
		if channel.Name == m.Name {
			m.ChannelID = channel.ID
			break
		}
	}

	// Connect the gateway and mailbox on StreamIoT.
	if err = client.ChannelConnect(a.Token, m.ChannelID, g.DeviceID); err != nil {
		return
	}

	// Setup the SenML message.
	senml := make([]map[string]interface{}, 0, 1)
	senml = append(senml, map[string]interface{}{
		"bn": fmt.Sprintf("%s_", m.ChannelID),
		"n":  "Mailbox",
		"u":  "PublicKey",
		"vs": m.PublicKey,
	})

	// Notify the gateway channel of the new mailbox using StreamIoT.
	if err = client.ChannelMessageCreate(g.DeviceKey, g.ChannelID, senml); err != nil {
		return
	}

	err = Create(m)
	return
}

func (g *Gateway) Delete() (err error) {
	// Setup the SenML message.
	senml := make([]map[string]interface{}, 0, 1)
	senml = append(senml, map[string]interface{}{
		"bn": fmt.Sprintf("%s_", g.ChannelID),
		"n":  "DESTRUCT",
		"u":  "Gateway",
		"vs": g.PublicKey,
	})

	// Notify the gateway channel of the new mailbox using StreamIoT.
	if err = client.ChannelMessageCreate(g.DeviceKey, g.ChannelID, senml); err != nil {
		return
	}

	err = Delete(g)
	return
}

func (g *Gateway) Save() (err error) {
	if g.ID != 0 {
		err = Update(g)
	} else {
		err = Create(g)
	}
	return
}
