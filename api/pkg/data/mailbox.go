package data

import (
	"fmt"
	"time"

	"github.com/dustinengle/itshere/pkg/client"
)

type Mailbox struct {
	AccountID uint      `gorm:"" json:"accountId"`
	Address   string    `gorm:"" json:"address"`
	ChannelID string    `gorm:"" json:"channelId"`
	CreatedAt time.Time `gorm:"" json:"createdAt"`
	Flag      bool      `gorm:"" json:"flag"`
	GatewayID uint      `gorm:"" json:"gatewayId"`
	ID        uint      `gorm:"primary_key" json:"id,omitempty"`
	Locked    bool      `gorm:"" json:"locked"`
	Name      string    `gorm:"" json:"name"`
	Package   bool      `gorm:"" json:"package"`
	PINs      []PIN     `gorm:"" json:"pins"`
	Power     uint8     `gorm:"" json:"power"`
	PublicKey string    `gorm:"unique" json:"publicKey"`
	UpdatedAt time.Time `gorm:"" json:"updatedAt,omitempty"`
}

func (m *Mailbox) CreatePIN(p *PIN) (err error) {
	p.MailboxID = m.ID

	// Get the gateway for the mailbox so we can use the thing key.
	var g *Gateway
	if g, err = m.Gateway(); err != nil {
		return
	}

	// Setup the SenML message.
	senml := make([]map[string]interface{}, 0, 1)
	senml = append(senml, map[string]interface{}{
		"bn": fmt.Sprintf("%s_", g.DeviceID),
		"n":  "AUTH",
		"u":  "PIN",
		"v":  p.Number,
	})

	// Send a message on the mailbox channel from the gateway device.
	if err = client.ChannelMessageCreate(g.DeviceKey, m.ChannelID, senml); err != nil {
		return
	}

	err = Create(p)
	return
}

func (m *Mailbox) Delete() (err error) {
	err = Delete(m)
	return
}

func (m *Mailbox) DeletePIN(p *PIN) (err error) {
	// Get the gateway for the mailbox so we can use the thing key.
	var g *Gateway
	if g, err = m.Gateway(); err != nil {
		return
	}

	// Setup the SenML message.
	data := make([]map[string]interface{}, 0, 1)
	data = append(data, map[string]interface{}{
		"bn": fmt.Sprintf("%s_", g.DeviceID),
		"n":  "UNAUTH",
		"u":  "PIN",
		"v":  p.Number,
	})

	// Send a message on the mailbox channel from the gateway device.
	if err = client.ChannelMessageCreate(g.DeviceKey, m.ChannelID, data); err != nil {
		return
	}

	err = Delete(p)
	return
}

func (m *Mailbox) Gateway() (g *Gateway, err error) {
	g = &Gateway{
		ID: m.GatewayID,
	}
	err = Single(g)
	return
}

func (m *Mailbox) Save() (err error) {
	if m.ID != 0 {
		err = Update(m)
	} else {
		err = Create(m)
	}
	return
}
