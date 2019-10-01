package gateway

import "time"

type Gateway struct {
	AccountID uint       `gorm:"" json:"accountId"`
	ChannelID string     `gorm:"unique" json:"channelId"`
	CreatedAt time.Time  `gorm:"" json:"createdAt"`
	DeletedAt *time.Time `gorm:"" json:"deletedAt,omitempty"`
	DeviceID  string     `gorm:"unique" json:"deviceId"`
	DeviceKey string     `gorm:"unique" json:"deviceKey"`
	ID        uint       `gorm:"primary_key" json:"id,omitempty"`
	MailboxID uint       `gorm:"" json:"mailboxId"`
	PublicKey string     `gorm:"unique" json:"publicKey"`
	SN        string     `gorm:"unique" json:"sn"`
	Status    string     `gorm:"" json:"status"`
	UpdatedAt time.Time  `gorm:"" json:"updatedAt,omitempty"`
}

func New(accountID, mailboxID uint, sn string) (g *Gateway) {
	g = &Gateway{
		AccountID: accountID,
		CreatedAt: time.Now().UTC(),
		MailboxID: mailboxID,
		SN:        sn,
		Status:    "AWAITING_ACTIVATION",
	}
	return
}
