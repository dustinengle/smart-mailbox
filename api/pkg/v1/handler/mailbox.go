package handler

import (
	"fmt"
	"time"

	"github.com/dustinengle/itshere/pkg/client"
	"github.com/dustinengle/itshere/pkg/data"
	"github.com/dustinengle/itshere/pkg/v1/reply"
	"github.com/gin-gonic/gin"
)

func DeleteMailbox(c *gin.Context) {
	mailbox := new(data.Mailbox)
	if err := c.BindJSON(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the gateway.
	gateway := &data.Gateway{ID: mailbox.GatewayID}
	if err := data.Single(gateway); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Delete pins.
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

	// Send the new message to the gateway channel.
	senml := []map[string]interface{}{
		map[string]interface{}{
			"bn": fmt.Sprintf("%s_", gateway.DeviceID),
			"n":  "DELETE",
			"u":  "PublicKey",
			"vs": mailbox.PublicKey,
		},
	}
	if err := client.ChannelMessageCreate(gateway.DeviceKey, gateway.ChannelID, senml); err != nil {
		reply.BadGateway(c, err)
		return
	}

	// V2: add cleanup on StreamIoT.

	if err := mailbox.Delete(); err != nil {
		reply.BadRequest(c, err)
		return
	}
	reply.OK(c, "OK")
}

func DeletePIN(c *gin.Context) {
	req := new(IDs)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Load the pin from the database.
	pin := &data.PIN{ID: req.ID}
	if err := data.Single(pin); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Load the mailbox for the pin.
	mailbox := &data.Mailbox{ID: pin.MailboxID}
	if err := data.Related(pin, mailbox); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Remove the pin from the system.
	if err := mailbox.DeletePIN(pin); err != nil {
		reply.BadGateway(c, err)
		return
	}

	reply.OK(c, "OK")
}

func PostMailbox(c *gin.Context) {
	// Validate request while binding.
	req := new(Mailbox)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the gateway.
	gateway := &data.Gateway{ID: req.GatewayID}
	if err := data.Single(gateway); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Create the mailbox.
	mailbox := &data.Mailbox{
		Name:      req.Name,
		PublicKey: req.PublicKey,
	}
	if err := gateway.CreateMailbox(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Send the new message to the gateway channel.
	senml := []map[string]interface{}{
		map[string]interface{}{
			"bn": fmt.Sprintf("%s_", gateway.DeviceID),
			"n":  "ADD",
			"u":  "PublicKey",
			"vs": mailbox.PublicKey,
		},
	}
	if err := client.ChannelMessageCreate(gateway.DeviceKey, gateway.ChannelID, senml); err != nil {
		reply.BadGateway(c, err)
		return
	}

	reply.OK(c, mailbox)
}

func PostMessage(c *gin.Context) {
	req := new(Message)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}
	fmt.Println("req:", req)

	// Get the mailbox from the database.
	mailbox := &data.Mailbox{ID: req.MailboxID}
	if err := data.Single(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the gateway for the mailbox.
	gateway := &data.Gateway{ID: req.GatewayID}
	if err := data.Related(mailbox, gateway); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Send the message to StreamIoT.
	if err := client.ChannelMessageCreate(gateway.DeviceKey, mailbox.ChannelID, &req.SenML); err != nil {
		reply.BadGateway(c, err)
		return
	}

	reply.OK(c, "OK")
}

func PostPIN(c *gin.Context) {
	// Validate request while binding.
	req := new(PIN)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the mailbox for the logged in user.
	mailbox := &data.Mailbox{ID: req.MailboxID}
	if err := data.Single(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Create the pin for the mailbox.
	pin := &data.PIN{
		Email:     req.Email,
		MailboxID: req.MailboxID,
		Name:      req.Name,
		Number:    req.Number,
		Phone:     req.Phone,
		Single:    req.Single,
		Timeout:   time.Unix(int64(req.Timeout), 0).UTC(),
	}
	if err := mailbox.CreatePIN(pin); err != nil {
		reply.BadRequest(c, err)
		return
	}
	reply.OK(c, pin)
}

func PutMailbox(c *gin.Context) {
	reply.OK(c, "OK")
}
