package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/dustinengle/smart-mailbox/pkg/client"
)

var _token string

func main() {
	femail := flag.String("email", "", "login email address")
	fpassword := flag.String("password", "", "login password for given email")
	flag.Parse()
	if *femail == "" || *fpassword == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	// Login
	fmt.Printf("\n*** LOGIN ***\n\n")
	token, err := client.UserLogin(*femail, *fpassword)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(token)
	_token = token.Token

	// List channels
	fmt.Printf("\n*** CHANNELS ***\n\n")
	channels, err := client.ChannelRead(_token, 10, 0)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(channels)

	// List things
	fmt.Printf("\n*** THINGS ***\n\n")
	things, err := client.ThingRead(_token, 10, 0)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(things)

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

		// Post a test message to the channel under the thing.
		data := make([]map[string]interface{}, 0)
		data = append(data, map[string]interface{}{
			"bn": "SAFEBOX_",
			"n":  "TEST",
			"u":  "CHECK",
			"vb": true,
		})
		fmt.Printf("Send: %s\n", data)
		if err = client.ChannelMessageCreate(thing.Key, channel.ID, data); err != nil {
			log.Fatal(err)
		}

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
		//log.Fatal(err)
	}
	fmt.Println(balance)

	// List the device totals.
	fmt.Printf("\n*** TOTALS ***\n\n")
	deviceTotals, err := client.UserDeviceTotals(_token, *femail)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(deviceTotals)
}
