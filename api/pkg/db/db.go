package db

import (
	"github.com/dustinengle/smart-mailbox/pkg/account"
	"github.com/dustinengle/smart-mailbox/pkg/gateway"
	"github.com/dustinengle/smart-mailbox/pkg/mailbox"
	"github.com/dustinengle/smart-mailbox/pkg/user"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB

func Close() (err error) {
	err = db.Close()
	return
}

func DB() *gorm.DB {
	return db
}

func Open(path string) (err error) {
	if db, err = gorm.Open("sqlite3", path); err != nil {
		return
	}

	db.AutoMigrate(&account.Account{})
	db.AutoMigrate(&gateway.Gateway{})
	db.AutoMigrate(&mailbox.Mailbox{})
	db.AutoMigrate(&mailbox.PIN{})
	db.AutoMigrate(&user.User{})
	return
}
