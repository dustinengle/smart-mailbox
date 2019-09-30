package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/dustinengle/smart-mailbox/pkg/client"
)

var _token string

func main() {
	fcreate := flag.Bool("create", false, "create new items in the process")
	femail := flag.String("email", "", "login email address")
	fpassword := flag.String("password", "", "login password for given email")
	flag.Parse()
	if *femail == "" || *fpassword == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	// Register
	if *fcreate {
		fmt.Printf("\n*** REGISTER ***\n\n")
		if err := client.UserRegister(*femail, *fpassword); err != nil {
			log.Fatal(err)
		}

		time.Sleep(300)
	}

	// Login
	fmt.Printf("\n*** LOGIN ***\n\n")
	token, err := client.UserLogin(*femail, *fpassword)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(token)
	_token = token.Token

	// Create channel
	if *fcreate {
		fmt.Printf("\n*** CHANNEL ***\n\n")
		if err = client.ChannelCreate(_token, "test-1"); err != nil {
			log.Fatal(err)
		}

		time.Sleep(300)
	}

	// List channels
	fmt.Printf("\n*** CHANNELS ***\n\n")
	channels, err := client.ChannelRead(_token, 10, 0)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(channels)
	channel := channels.Channels[0]

	// Create thing
	if *fcreate {
		fmt.Printf("\n*** THING ***\n\n")
		if err = client.ThingCreate(_token, "app-1", "app"); err != nil {
			log.Fatal(err)
		}

		time.Sleep(300)
	}

	// List things
	fmt.Printf("\n*** THINGS ***\n\n")
	things, err := client.ThingRead(_token, 10, 0)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(things)
	thing := things.Things[0]

	// Connect channel and thing
	if *fcreate {
		fmt.Printf("\n*** CONNECT ***\n\n")
		if err = client.ChannelConnect(_token, channel.ID, thing.ID); err != nil {
			log.Fatal(err)
		}

		time.Sleep(300)
	}

	// Post a test message to the channel under the thing.
	fmt.Printf("\n*** MESSAGE ***\n\n")
	data := make([]map[string]interface{}, 0)
	data = append(data, map[string]interface{}{
		"bn": "SAFEBOX_",
		"n":  "TEST",
		"u":  "CHECK",
		"vb": true,
	})
	if err = client.ChannelMessageCreate(thing.Key, channel.ID, data); err != nil {
		log.Fatal(err)
	}
	fmt.Println(data)

	time.Sleep(1000)

	// List all messages per channel
	fmt.Printf("\n*** MESSAGES ***\n\n")
	for _, channel := range channels.Channels {
		// Get list of connected things
		channelThings, err := client.ChannelThingRead(_token, channel.ID, 10)
		if err != nil {
			fmt.Println(channel)
			log.Fatal(err)
		}

		// If there are no connected things to the channel continue
		// to the next channel.
		if channelThings.Total == 0 {
			continue
		}

		// Use the first thing to gain access to the channel messages.
		thing := channelThings.Things[0]

		// Get the list of message for the channel thing combination.
		channelMessages, err := client.ChannelMessageRead(thing.Key, channel.ID, 10)
		if err != nil {
			fmt.Println(channel)
			log.Fatal(err)
		}
		fmt.Printf("Channel: %s\tThing: %s\n", channel.ID, thing.ID)
		fmt.Println(channelMessages)
	}

	// List the user account balance.
	fmt.Printf("\n*** BALANCE ***\n\n")
	balance, err := client.UserBalance(_token, *femail)
	if err != nil {
		// Only print this as it is returned as text.
		fmt.Println(err)
	}
	balance = strings.ReplaceAll(balance, "{", "")
	balance = strings.ReplaceAll(balance, "}", "")
	balance = strings.ReplaceAll(balance, ":", "")
	parts := strings.Split(balance, " ")
	fmt.Printf("%s = %s\n", parts[0], parts[1])

	// List the device totals.
	fmt.Printf("\n*** TOTALS ***\n\n")
	deviceTotals, err := client.UserDeviceTotals(_token, *femail)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(deviceTotals)
}
