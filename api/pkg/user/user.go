package user

import "time"

type User struct {
	AccountID uint       `gorm:"" json:"accountId"`
	CreatedAt time.Time  `gorm:"" json:"createdAt"`
	DeletedAt *time.Time `gorm:"" json:"deletedAt"`
	Email     string     `gorm:"unique" json:"email"`
	Google    bool       `gorm:"" json:"google"`
	ID        uint       `gorm:"primary_key" json:"id"`
	Name      string     `gorm:"" json:"name"`
	Phone     string     `gorm:"unique" json:"phone"`
	PushToken string     `gorm:"unique" json:"pushToken"`
	Token     string     `gorm:"unique" json:"token"`
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
