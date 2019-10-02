package user

import "time"

type User struct {
	AccountID    uint       `gorm:"" json:"accountId"`
	CreatedAt    time.Time  `gorm:"" json:"createdAt"`
	DeletedAt    *time.Time `gorm:"" json:"deletedAt,omitempty"`
	Email        string     `gorm:"unique" json:"email"`
	Google       bool       `gorm:"" json:"google,omitempty"`
	ID           uint       `gorm:"primary_key" json:"id,omitempty"`
	Name         string     `gorm:"" json:"name"`
	Password     string     `gorm:"" json:"password,omitempty"`
	Phone        string     `gorm:"unique" json:"phone,omitempty"`
	PushToken    string     `gorm:"unique" json:"pushToken,omitempty"`
	RefreshToken string     `gorm:"unique" json:"refreshToken,omitempty"`
	Token        string     `gorm:"unique" json:"token,omitempty"`
	UpdatedAt    time.Time  `gorm:"" json:"updatedAt,omitempty"`
}

func New(accountID uint, name, email, phone string) (u *User) {
	u = &User{
		AccountID: accountID,
		CreatedAt: time.Now().UTC(),
		Email:     email,
		Name:      name,
		Phone:     phone,
	}
	return
}
