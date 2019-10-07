package handler

import (
	"fmt"
	"time"

	"github.com/dustinengle/smart-mailbox/pkg/api/reply"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/model"
	"github.com/gin-gonic/gin"
)

func PostActivate(c *gin.Context) {
	// Validate request while binding.
	req := new(Activate)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Fetch information needed for gateway to setup.
	mailbox := &model.Mailbox{
		Gateway: req.Gateway,
	}
	if err := db.Single(mailbox); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// If already activated then pitch a bitch.
	t := time.Time{}
	if mailbox.ActivatedAt != t {
		reply.Unauthorized(c, fmt.Errorf("Unauthorized"))
		return
	}

	// Now update the activated at and save.
	mailbox.ActivatedAt = time.Now().UTC()
	if err := db.Save(mailbox); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Return the required information map.
	reply.OK(c, mailbox)
}
