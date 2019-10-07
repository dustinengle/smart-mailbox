package model

import "time"

type Mailbox struct {
	AccountID   uint       `gorm:"" json:"accountId"`
	ActivatedAt time.Time  `gorm:"" json:"activatedAt"`
	ChannelID   string     `gorm:"" json:"channelId"`
	CreatedAt   time.Time  `gorm:"" json:"createdAt"`
	DeletedAt   *time.Time `gorm:"" json:"deletedAt,omitempty"`
	DeviceID    string     `gorm:"" json:"deviceId"`
	DeviceKey   string     `gorm:"" json:"deviceKey"`
	Flag        bool       `gorm:"" json:"flag"`
	Gateway     string     `gorm:"" json:"gateway"`
	ID          uint       `gorm:"primary_key" json:"id,omitempty"`
	Key         string     `gorm:"" json:"key"`
	Locked      bool       `gorm:"" json:"locked"`
	Name        string     `gorm:"" json:"name"`
	Package     bool       `gorm:"" json:"package"`
	Power       uint8      `gorm:"" json:"power"`
	PublicKey   string     `gorm:"" json:"publicKey"`
	SN          string     `gorm:"unique" json:"sn"`
	UpdatedAt   time.Time  `gorm:"" json:"updatedAt,omitempty"`
}
