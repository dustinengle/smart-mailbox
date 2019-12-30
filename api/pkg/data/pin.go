package data

import "time"

type PIN struct {
	CreatedAt time.Time `gorm:"" json:"createdAt"`
	Email     string    `gorm:"" json:"email"`
	ID        uint      `gorm:"primary_key" json:"id"`
	MailboxID uint      `gorm:"" json:"mailboxId"`
	Name      string    `gorm:"" json:"name"`
	Number    uint32    `gorm:"" json:"number"`
	Phone     string    `gorm:"" json:"phone"`
	Single    bool      `gorm:"" json:"single"`
	Timeout   time.Time `gorm:"" json:"timeout"`
	UpdatedAt time.Time `gorm:"" json:"updatedAt"`
}
