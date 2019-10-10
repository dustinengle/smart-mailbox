package handler

import (
	"fmt"
	"strconv"
	"time"

	"github.com/dustinengle/smart-mailbox/pkg/client"

	"github.com/dustinengle/smart-mailbox/pkg/api/reply"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/model"
	"github.com/gin-gonic/gin"
)

func DeleteMailbox(c *gin.Context) {
	// Get the param mailboxID value.
	mailboxID := c.Param("mailboxID")
	if mailboxID == "" {
		reply.BadRequest(c, fmt.Errorf("missing mailbox id"))
		return
	}

	// Convert the id to uint.
	mid, err := strconv.ParseUint(mailboxID, 10, 64)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the account id.
	accountID := c.MustGet("accountID").(uint)

	// TODO: delete the channel and thing on StreamIOT.

	// Remove the mailbox and return OK.
	mailbox := &model.Mailbox{
		AccountID: accountID,
		ID:        uint(mid),
	}
	if err := db.Delete(mailbox); err != nil {
		reply.InternalServer(c, err)
		return
	}

	reply.OK(c, "OK")
}

func DeletePIN(c *gin.Context) {
	// Get the param mailboxID and pinID values.
	mailboxID := c.Param("mailboxID")
	pinID := c.Param("pinID")
	if mailboxID == "" || pinID == "" {
		reply.BadRequest(c, fmt.Errorf("missing mailbox and/or the pin id"))
		return
	}

	// Convert the string ids into numbers.
	mid, err := strconv.ParseUint(mailboxID, 10, 64)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}
	pid, err := strconv.ParseUint(pinID, 10, 64)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the account id.
	accountID := c.MustGet("accountID").(uint)

	// Remove the pin from the mailbox and return OK.
	pin := &model.PIN{
		AccountID: accountID,
		ID:        uint(pid),
		MailboxID: uint(mid),
	}
	if err = db.Delete(pin); err != nil {
		reply.InternalServer(c, err)
		return
	}

	reply.OK(c, "OK")
}

func GetMailbox(c *gin.Context) {
	// Get the account id.
	accountID := c.MustGet("accountID").(uint)

	// Return a list of all mailboxes for given account.
	results := make([]*model.Mailbox, 0)
	if err := db.Find(&results, "account_id == ?", &accountID); err != nil {
		reply.Unauthorized(c, err)
		return
	}

	// Get the pins for each mailbox.
	pins := make([]*model.PIN, 0)
	if err := db.Find(&pins, "account_id == ?", &accountID); err != nil {
		reply.Unauthorized(c, err)
		return
	}

	reply.OK(c, gin.H{"mailboxes": results, "pins": pins})
}

func GetMessages(c *gin.Context) {
	// Get the account id.
	accountID := c.MustGet("accountID").(uint)

	// Load the mailbox id from the param.
	mid := c.Param("mailboxID")

	// Convert the id into a uint.
	mailboxID, err := strconv.ParseUint(mid, 10, 64)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Load the mailbox from the database.
	mailbox := &model.Mailbox{
		AccountID: accountID,
		ID:        uint(mailboxID),
	}
	if err = db.Single(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Request channel message from StreamIOT.
	results, err := client.ChannelMessageRead(mailbox.DeviceKey, mailbox.ChannelID, 100)
	if err != nil {
		fmt.Printf("ERROR: unable to read messages: channel=%s,deviceKey=%s\n", mailbox.ChannelID, mailbox.DeviceKey)
		reply.BadGateway(c, err)
		return
	}

	// Return messages.
	reply.OK(c, results)
}

func GetPIN(c *gin.Context) {
	// Get the account id.
	accountID := c.MustGet("accountID").(uint)

	// Get the mailboxID value.
	mailboxID := c.Param("mailboxID")
	if mailboxID == "" {
		reply.BadRequest(c, fmt.Errorf("missing mailbox id"))
		return
	}

	// Return a list of pins for the mailbox.
	results := make([]*model.PIN, 0)
	if err := db.Find(&results, "account_id == ? AND mailbox_id == ?", accountID, mailboxID); err != nil {
		reply.BadRequest(c, err)
		return
	}

	reply.OK(c, results)
}

func PostMailbox(c *gin.Context) {
	// Validate and bind the request.
	req := new(Mailbox)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Validate the account id.
	accountID := c.MustGet("accountID").(uint)
	if accountID != req.AccountID {
		reply.BadRequest(c, fmt.Errorf("account ids do not match"))
		return
	}

	// Insert the mailbox into the database.
	mailbox := &model.Mailbox{
		AccountID: req.AccountID,
		Gateway:   req.Gateway,
		Key:       req.Key,
		Name:      req.Name,
		PublicKey: req.PublicKey,
		SN:        req.SN,
	}
	if err := db.Create(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Load the account token for the StreamIOT request.
	accountToken := c.MustGet("accountToken").(string)

	// Register the channel and thing in StreamIOT.
	if err := client.ChannelCreate(accountToken, req.Name); err != nil {
		reply.BadGateway(c, err)
		return
	}
	if err := client.ThingCreate(accountToken, req.Name, "device"); err != nil {
		reply.BadGateway(c, err)
		return
	}

	// Get the ids for the channel and thing.
	channels, err := client.ChannelRead(accountToken, 1000, 0)
	if err != nil {
		fmt.Println("unable to fetch channels", err, channels)
		reply.BadGateway(c, err)
		return
	}
	for _, channel := range channels.Channels {
		if channel.Name == req.Name {
			mailbox.ChannelID = channel.ID
			break
		}
	}
	things, err := client.ThingRead(accountToken, 1000, 0)
	if err != nil {
		fmt.Println("unable to fetch things", err, things)
		reply.BadGateway(c, err)
		return
	}
	for _, thing := range things.Things {
		if thing.Name == req.Name {
			mailbox.DeviceID = thing.ID
			mailbox.DeviceKey = thing.Key
			break
		}
	}

	// Update the mailbox information in the database.
	if err = db.Save(mailbox); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Connect the channel and thing in StreamIOT.
	if err = client.ChannelConnect(accountToken, mailbox.ChannelID, mailbox.DeviceID); err != nil {
		fmt.Println("unable to connect channel and thing", err)
		reply.BadGateway(c, err)
		return
	}

	// Return the mailbox object.
	reply.OK(c, mailbox)
}

func PostPIN(c *gin.Context) {
	// Validate and bind the request.
	req := new(PIN)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Validate the account id.
	accountID := c.MustGet("accountID").(uint)
	if accountID != req.AccountID {
		reply.BadRequest(c, fmt.Errorf("account ids do not match"))
		return
	}

	// Insert the pin into the database.
	pin := &model.PIN{
		AccountID: req.AccountID,
		Email:     req.Email,
		MailboxID: req.MailboxID,
		Name:      req.Name,
		Number:    req.Number,
		Phone:     req.Phone,
		Single:    req.Single,
		Timeout:   time.Unix(int64(req.Timeout), 0).UTC(),
	}
	if err := db.Create(pin); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Return the pin object.
	reply.OK(c, pin)
}

func PutMailbox(c *gin.Context) {
	// Validate and bind the request.
	req := new(Mailbox)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the param id.
	mailboxID := c.Param("mailboxID")
	if mailboxID == "" {
		reply.BadRequest(c, fmt.Errorf("missing mailbox id"))
		return
	}

	// Validate the account id.
	accountID := c.MustGet("accountID").(uint)
	if accountID != req.AccountID {
		reply.BadRequest(c, fmt.Errorf("account ids do not match"))
		return
	}

	// Pull the pin from the database.
	mailbox := new(model.Mailbox)
	if err := db.First(mailbox, "id == ?", mailboxID); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Update the mailbox in the database.
	mailbox.Name = req.Name
	if err := db.Save(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Return OK.
	reply.OK(c, mailbox)
}
