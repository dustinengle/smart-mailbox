package account

import "time"

type Account struct {
	ChannelID string     `gorm:"unique" json:"channelId"`
	CreatedAt time.Time  `gorm:"" json:"createdAt"`
	DeletedAt *time.Time `gorm:"" json:"deletedAt"`
	Email     string     `gorm:"unique" json:"email"`
	ID        uint       `gorm:"primary_key" json:"id"`
	Password  string     `gorm:"" json:"-"`
	PublicKey string     `gorm:"unique" json:"publicKey"`
	Token     string     `gorm:"" json:"-"`
	UpdatedAt time.Time  `gorm:"" json:"updatedAt"`
}

func New(email, password string) (a *Account) {
	a = &Account{
		CreatedAt: time.Now().UTC(),
		Email:     email,
		Password:  password,
	}
	return
}
