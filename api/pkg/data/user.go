package data

import (
	"time"

	"github.com/dustinengle/itshere/pkg/auth"
)

type User struct {
	AccountID uint      `gorm:"" json:"accountId"`
	CreatedAt time.Time `gorm:"" json:"createdAt"`
	Email     string    `gorm:"unique" json:"email"`
	Google    bool      `gorm:"" json:"google,omitempty"`
	ID        uint      `gorm:"primary_key" json:"id,omitempty"`
	Name      string    `gorm:"" json:"name"`
	Password  string    `gorm:"" json:"-"`
	Phone     string    `gorm:"" json:"phone,omitempty"`
	PushToken string    `gorm:"" json:"-"`
	Token     string    `gorm:"" json:"-"`
	UpdatedAt time.Time `gorm:"" json:"updatedAt,omitempty"`
}

func (u *User) ComparePasswords(password string) (err error) {
	err = auth.ComparePasswords(u.Password, password)
	return
}

func (u *User) Delete() (err error) {
	err = Delete(u)
	return
}

func (u *User) HashPassword() (err error) {
	u.Password, err = auth.HashPassword(u.Password)
	return
}

func (u *User) Save() (err error) {
	if u.ID != 0 {
		err = Update(u)
	} else {
		err = Create(u)
	}
	return
}
