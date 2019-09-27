package pin

import "time"

type PIN struct {
	AccountID uint       `gorm:"" json:"accountId"`
	CreatedAt time.Time  `gorm:"" json:"createdAt"`
	DeletedAt *time.Time `gorm:"" json:"deletedAt"`
	Email     string     `gorm:"" json:"email"`
	ID        uint       `gorm:"primary_key" json:"id"`
	MailboxID uint       `gorm:"" json:"mailboxId"`
	Number    uint32     `gorm:"" json:"number"`
	Phone     string     `gorm:"" json:"phone"`
	Single    bool       `gorm:"" json:"single"`
	Timeout   time.Time  `gorm:"" json:"timeout"`
	UpdatedAt time.Time  `gorm:"" json:"updatedAt"`
}

func New(accountID, mailboxID uint, number uint32) (p *PIN) {
	p = &PIN{
		AccountID: accountID,
		CreatedAt: time.Now().UTC(),
		MailboxID: mailboxID,
		Number:    number,
	}
	return
}
