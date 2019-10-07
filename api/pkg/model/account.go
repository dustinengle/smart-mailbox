package model

import "time"

type Account struct {
	CreatedAt time.Time  `gorm:"" json:"createdAt"`
	DeletedAt *time.Time `gorm:"" json:"deletedAt,omitempty"`
	Email     string     `gorm:"unique" json:"email"`
	ID        uint       `gorm:"primary_key" json:"id,omitempty"`
	Password  string     `gorm:"" json:"-"`
	PublicKey string     `gorm:"unique" json:"publicKey,omitempty"`
	Token     string     `gorm:"" json:"-"`
	UpdatedAt time.Time  `gorm:"" json:"updatedAt,omitempty"`
}
