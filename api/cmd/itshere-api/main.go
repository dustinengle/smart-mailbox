package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/dustinengle/itshere/pkg/auth"
	"github.com/dustinengle/itshere/pkg/data"
	v1 "github.com/dustinengle/itshere/pkg/v1"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	db := os.Getenv("API_DATA")
	err := data.Open("sqlite3", db)
	if err != nil {
		log.Fatal("db", err)
	}
	defer data.Close()

	secret := os.Getenv("JWT_SECRET")
	auth.SetSecret(secret)

	close := make(chan os.Signal, 1)
	signal.Notify(close, os.Interrupt, syscall.SIGINT)

	go func() {
		addr := os.Getenv("API_ADDR")
		if err := v1.Run(addr); err != nil {
			fmt.Println(err)
			close <- os.Interrupt
		}
	}()

	<-close
	fmt.Println("Goodbye!")
}
