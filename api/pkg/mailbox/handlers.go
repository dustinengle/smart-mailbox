package mailbox

import (
	"net/http"

	"github.com/dustinengle/smart-mailbox/pkg/client"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
)

func DeleteMailbox(c *gin.Context) {
	mailbox := new(Mailbox)
	if err := c.BindJSON(mailbox); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Delete(mailbox); err != nil {
		reply.Error(c, err, http.StatusInternalServerError)
		return
	}

	reply.OK(c, "OK")
}

func DeletePIN(c *gin.Context) {
	pin := new(PIN)
	if err := c.BindJSON(pin); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Delete(pin); err != nil {
		reply.Error(c, err, http.StatusInternalServerError)
		return
	}

	reply.OK(c, "OK")
}

func GetMailbox(c *gin.Context) {
	mailbox := new(Mailbox)
	if err := c.BindJSON(mailbox); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, mailbox)
}

func PostMailbox(c *gin.Context) {
	mailbox := new(Mailbox)
	if err := c.BindJSON(mailbox); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	token := c.MustGet("accountToken").(string)
	if err := client.ThingCreate(token, mailbox.Name, "device"); err != nil {
		reply.Error(c, err, http.StatusBadGateway)
		return
	}

	if err := db.Create(mailbox); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, mailbox)
}

func PostMailboxes(c *gin.Context) {
	mailboxes := make([]*Mailbox, 0)
	if err := db.Find(&mailboxes, ""); err != nil {
		reply.Error(c, err, http.StatusInternalServerError)
		return
	}

	reply.OK(c, mailboxes)
}

func PostPIN(c *gin.Context) {
	pin := new(PIN)
	if err := c.BindJSON(pin); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Create(pin); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, pin)
}

func PostPINs(c *gin.Context) {
	pins := make([]*PIN, 0)
	if err := db.Find(pins, ""); err != nil {
		reply.Error(c, err, http.StatusInternalServerError)
		return
	}

	reply.OK(c, pins)
}

func PutMailbox(c *gin.Context) {
	mailbox := new(Mailbox)
	if err := c.BindJSON(mailbox); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	if err := db.Save(mailbox); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, mailbox)
}
