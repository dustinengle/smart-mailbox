package handler

import (
	"fmt"
	"time"

	"github.com/dustinengle/itshere/pkg/client"
	"github.com/dustinengle/itshere/pkg/data"
	"github.com/dustinengle/itshere/pkg/v1/reply"
	"github.com/gin-gonic/gin"
)

func DeleteGateway(c *gin.Context) {
	gateway := new(data.Gateway)
	if err := c.BindJSON(gateway); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get mailboxes.
	mailboxes := make([]*data.Mailbox, 0)
	if err := data.Related(gateway, &mailboxes); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Delete pins for each mailbox.
	for _, mailbox := range mailboxes {
		pins := make([]*data.PIN, 0)
		if err := data.Related(mailbox, &pins); err != nil {
			reply.BadRequest(c, err)
			return
		}
		for _, pin := range pins {
			if err := data.Delete(&pin); err != nil {
				reply.InternalServer(c, err)
				return
			}
		}
	}

	// Delete mailboxes.
	for _, mailbox := range mailboxes {
		if err := data.Delete(&mailbox); err != nil {
			reply.InternalServer(c, err)
			return
		}
	}

	// V2: add cleanup on StreamIoT.

	if err := gateway.Delete(); err != nil {
		reply.BadRequest(c, err)
		return
	}
	reply.OK(c, "OK")
}

func PostActivate(c *gin.Context) {
	// Validate request while binding.
	req := new(Activate)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the gateway from the database.
	gateway := &data.Gateway{PublicKey: req.PublicKey}
	if err := data.Single(gateway); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Update the activated at information.
	gateway.ActivatedAt = time.Now().UTC()
	if err := gateway.Save(); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Get the mailboxes for the gateway.
	mailboxes := make([]*data.Mailbox, 0)
	if err := data.Find(&mailboxes, "gateway_id = ?", gateway.ID); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Return the required information map.
	reply.OK(c, map[string]interface{}{
		"mailboxes": mailboxes,
		"gateway":   gateway,
	})
}

func PostConnect(c *gin.Context) {
	// Validate request while binding.
	req := new(Activate)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}
	fmt.Println("PostConnect:", req)

	// Get the gateway from the database.
	gateway := &data.Gateway{PublicKey: req.PublicKey}
	if err := data.Single(gateway); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Send the CONNECT request to StreamIOT.
	senml := []map[string]interface{}{
		map[string]interface{}{
			"bn": fmt.Sprintf("%s_", gateway.DeviceID),
			"n":  "CONNECT",
			"u":  "Requested",
			"vb": true,
		},
	}
	if err := client.ChannelMessageCreate(gateway.DeviceKey, gateway.ChannelID, senml); err != nil {
		reply.BadGateway(c, err)
		return
	}

	time.Sleep(2 * time.Second)

	// Send the REGISTER request to StreamIOT.
	senml = []map[string]interface{}{
		map[string]interface{}{
			"bn": fmt.Sprintf("%s_", gateway.DeviceID),
			"n":  "REGISTER",
			"u":  "Requested",
			"vb": true,
		},
	}
	if err := client.ChannelMessageCreate(gateway.DeviceKey, gateway.ChannelID, senml); err != nil {
		reply.BadGateway(c, err)
		return
	}

	// Update the activated at information.
	gateway.ActivatedAt = time.Now().UTC()
	if err := gateway.Save(); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Get the mailboxes for the gateway.
	mailboxes := make([]*data.Mailbox, 0)
	if err := data.Find(&mailboxes, "gateway_id = ?", gateway.ID); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Return the required information map.
	reply.OK(c, map[string]interface{}{
		"mailboxes": mailboxes,
		"gateway":   gateway,
	})
}

func PostGateway(c *gin.Context) {
	// Validate request while binding.
	req := new(Gateway)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}
	fmt.Println("req:", req)
	// Get the account for the logged in user.
	accountID := c.MustGet("_accountID").(uint)
	account := &data.Account{ID: accountID}
	if err := data.Single(account); err != nil {
		reply.InternalServer(c, err)
		return
	}

	gateway, err := account.CreateGateway(req.Name, req.PublicKey)
	if err != nil {
		reply.BadGateway(c, err)
		return
	}
	reply.OK(c, gateway)
}

func PutGateway(c *gin.Context) {
	// Validate request while binding.
	req := new(Gateway)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the gateway from the database.
	gateway := &data.Gateway{ID: req.ID}
	if err := data.Single(gateway); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Update the name of the gateway.
	gateway.Name = req.Name
	gateway.PublicKey = req.PublicKey
	if err := gateway.Save(); err != nil {
		reply.BadRequest(c, err)
		return
	}

	reply.OK(c, "OK")
}
