package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/dustinengle/smart-mailbox/pkg/api"
	_ "github.com/dustinengle/smart-mailbox/pkg/client"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/model"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	var err error

	close := make(chan os.Signal, 1)
	signal.Notify(close, os.Interrupt, syscall.SIGINT)

	path := os.Getenv("DB_PATH")
	if err = db.Open(path); err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	db.Migrate([]interface{}{
		&model.Account{},
		&model.Mailbox{},
		&model.PIN{},
		&model.User{},
	})

	go func() {
		addr := os.Getenv("API_ADDR")
		if err = api.Run(addr); err != nil {
			log.Fatal(err)
		}
	}()

	<-close
	fmt.Println("Closing")
}
