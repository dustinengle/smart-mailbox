package db

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB

func Close() (err error) {
	err = db.Close()
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

func Migrate(vs []interface{}) {
	for _, v := range vs {
		db.AutoMigrate(v)
	}
}

func Open(path string) (err error) {
	if db, err = gorm.Open("sqlite3", path); err != nil {
		return
	}
	return
}

func Save(v interface{}) (err error) {
	err = db.Save(v).Error
	return
}

func Single(v interface{}) (err error) {
	err = db.Where(v).First(v).Error
	return
}
