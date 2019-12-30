package data

import (
	"github.com/jinzhu/gorm"
)

var db *gorm.DB

func Close() (err error) {
	err = db.Close()
	return
}

func Count(v interface{}, query string, args ...interface{}) (n int, err error) {
	err = db.Where(query, args...).Find(v).Count(&n).Error
	return
}

func Create(v interface{}) (err error) {
	err = db.Create(v).Error
	return
}

func DB() *gorm.DB {
	return db
}

func Delete(v interface{}) (err error) {
	err = db.Delete(v).Error
	return
}

func DeleteAll(vs []interface{}) (err error) {
	for _, v := range vs {
		if err = Delete(v); err != nil {
			return
		}
	}
	return
}

func Find(vs interface{}, query string, args ...interface{}) (err error) {
	d := db
	if query != "" {
		d = d.Where(query, args...)
	}
	err = d.Find(vs).Error
	return
}

func First(v interface{}, query string, args ...interface{}) (err error) {
	d := db
	if query != "" {
		d = d.Where(query, args...)
	}
	err = d.First(v).Error
	return
}

func Migrate() {
	vs := []interface{}{
		&Account{},
		&Gateway{},
		&Mailbox{},
		&PIN{},
		&User{},
	}
	for _, v := range vs {
		db.AutoMigrate(v)
	}
}

func Open(dialect, path string) (err error) {
	if db, err = gorm.Open(dialect, path); err != nil {
		return
	}
	Migrate()
	return
}

func Related(v, w interface{}) (err error) {
	err = db.Model(v).Related(w).Error
	return
}

func Single(v interface{}) (err error) {
	err = db.Where(v).First(v).Error
	return
}

func Update(v interface{}) (err error) {
	err = db.Save(v).Error
	return
}
