package model

import "time"

type User struct {
	AccountID    uint       `gorm:"" json:"accountId"`
	CreatedAt    time.Time  `gorm:"" json:"createdAt"`
	DeletedAt    *time.Time `gorm:"" json:"deletedAt,omitempty"`
	Email        string     `gorm:"unique" json:"email"`
	Google       bool       `gorm:"" json:"google,omitempty"`
	ID           uint       `gorm:"primary_key" json:"id,omitempty"`
	Name         string     `gorm:"" json:"name"`
	Password     string     `gorm:"" json:"-"`
	Phone        string     `gorm:"" json:"phone,omitempty"`
	PushToken    string     `gorm:"" json:"-"`
	RefreshToken string     `gorm:"" json:"-"`
	Token        string     `gorm:"" json:"-"`
	UpdatedAt    time.Time  `gorm:"" json:"updatedAt,omitempty"`
}
