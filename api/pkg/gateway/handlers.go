package gateway

import (
	"net/http"

	"github.com/dustinengle/smart-mailbox/pkg/client"
	"github.com/dustinengle/smart-mailbox/pkg/mailbox"

	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
)

func DeleteGateway(c *gin.Context) {
	gateway := new(Gateway)
	if err := c.BindJSON(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Delete(gateway); err != nil {
		reply.Error(c, err, http.StatusInternalServerError)
		return
	}

	reply.OK(c, "OK")
}

func PostActivate(c *gin.Context) {
	gateway := new(Gateway)
	if err := c.BindJSON(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	mailbox := &mailbox.Mailbox{ID: gateway.MailboxID}
	if err := db.Single(mailbox); err != nil {
		reply.Error(c, err, http.StatusNotFound)
		return
	}

	reply.OK(c, gin.H{"gateway": gateway, "mailbox": mailbox})
}

func PostBalance(c *gin.Context) {
	gateway := new(Gateway)
	if err := c.BindJSON(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Single(gateway); err != nil {
		reply.Error(c, err, http.StatusInternalServerError)
		return
	}

	// TODO: get balance from gateway or maybe stellar directly.

	reply.OK(c, gateway)
}

func PostGateway(c *gin.Context) {
	gateway := new(Gateway)
	if err := c.BindJSON(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	token := c.MustGet("accountToken").(string)
	if err := client.ChannelCreate(token, gateway.SN); err != nil {
		reply.Error(c, err, http.StatusBadGateway)
		return
	}

	gateway.AccountID = uint(c.MustGet("accountID").(uint64))

	if err := db.Create(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, gateway)
}

func PostGateways(c *gin.Context) {
	gateways := make([]*Gateway, 0)
	if err := db.Find(gateways, ""); err != nil {
		reply.Error(c, err, http.StatusInternalServerError)
		return
	}

	reply.OK(c, gateways)
}

func PostMessage(c *gin.Context) {
	// TODO: send a message to StreamIOT for this gateway and mailbox.

	reply.OK(c, gin.H{"OK": "PostMessage"})
}

func PostMessages(c *gin.Context) {
	gateway := new(Gateway)
	if err := c.BindJSON(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	token := c.MustGet("accountToken").(string)
	messages, err := client.ChannelMessageRead(token, gateway.ChannelID, 100)
	if err != nil {
		reply.Error(c, err, http.StatusBadGateway)
		return
	}

	reply.OK(c, messages)
}

func PutGateway(c *gin.Context) {
	gateway := new(Gateway)
	if err := c.BindJSON(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Save(gateway); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, gateway)
}
