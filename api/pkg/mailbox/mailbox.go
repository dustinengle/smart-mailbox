package mailbox

import "time"

type Mailbox struct {
	AccountID uint       `gorm:"" json:"accountId"`
	CreatedAt time.Time  `gorm:"" json:"createdAt"`
	DeletedAt *time.Time `gorm:"" json:"deletedAt,omitempty"`
	ID        uint       `gorm:"primary_key" json:"id,omitempty"`
	Name      string     `gorm:"unique" json:"name"`
	SN        string     `gorm:"unique" json:"sn"`
	Status    string     `gorm:"" json:"status"`
	UpdatedAt time.Time  `gorm:"" json:"updatedAt,omitempty"`
}

func New(accountID uint, name, sn string) (m *Mailbox) {
	m = &Mailbox{
		AccountID: accountID,
		CreatedAt: time.Now().UTC(),
		Name:      name,
		SN:        sn,
		Status:    "AWAITING_ACTIVATION",
	}
	return
}

func (m *Mailbox) NewPIN(accountID, mailboxID uint, number uint32) (p *PIN) {
	p = &PIN{
		AccountID: accountID,
		CreatedAt: time.Now().UTC(),
		MailboxID: mailboxID,
		Number:    number,
	}
	return
}
