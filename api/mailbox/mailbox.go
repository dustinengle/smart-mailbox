package mailbox

import "time"

type Mailbox struct {
	AccountID uint       `gorm:"" json:"accountId"`
	CreatedAt time.Time  `gorm:"" json:"createdAt"`
	DeletedAt *time.Time `gorm:"" json:"deletedAt"`
	ID        uint       `gorm:"primary_key" json:"id"`
	Name      string     `gorm:"unique" json:"name"`
	SN        string     `gorm:"unique" json:"sn"`
	Status    string     `gorm:"" json:"status"`
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
