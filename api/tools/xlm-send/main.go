package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/stellar/go/build"
	"github.com/stellar/go/clients/horizon"
)

func main() {
	famount := flag.String("amount", "", "the amount to send to the public key")
	fpublic := flag.String("public", "", "the public key to send amount to")
	fsecret := flag.String("secret", "", "secret key of account to send from")
	flag.Parse()
	if *famount == "" && *fpublic == "" || *fsecret == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	// Make sure destination account exists
	if _, err := horizon.DefaultTestNetClient.LoadAccount(*fpublic); err != nil {
		panic(err)
	}

	tx, err := build.Transaction(
		build.TestNetwork,
		build.SourceAccount{*fsecret},
		build.AutoSequence{horizon.DefaultTestNetClient},
		build.Payment(
			build.Destination{*fpublic},
			build.NativeAmount{*famount},
		),
	)

	if err != nil {
		panic(err)
	}

	// Sign the transaction to prove you are actually the person sending it.
	txe, err := tx.Sign(*fsecret)
	if err != nil {
		panic(err)
	}

	txeB64, err := txe.Base64()
	if err != nil {
		panic(err)
	}

	// And finally, send it off to Stellar!
	resp, err := horizon.DefaultTestNetClient.SubmitTransaction(txeB64)
	if err != nil {
		panic(err)
	}

	fmt.Println("Successful Transaction:")
	fmt.Println("Ledger:", resp.Ledger)
	fmt.Println("Hash:", resp.Hash)
}
