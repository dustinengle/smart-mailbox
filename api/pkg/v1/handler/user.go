package handler

import (
	"fmt"

	"github.com/dustinengle/itshere/pkg/auth"
	"github.com/dustinengle/itshere/pkg/client"
	"github.com/dustinengle/itshere/pkg/data"
	"github.com/dustinengle/itshere/pkg/v1/reply"
	"github.com/gin-gonic/gin"
)

func DeleteUser(c *gin.Context) {
	user := new(data.User)
	if err := c.BindJSON(user); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// V2: add cleanup on StreamIoT.

	if err := user.Delete(); err != nil {
		reply.BadRequest(c, err)
		return
	}
	reply.OK(c, "OK")
}

func GetDetails(c *gin.Context) {
	userID := c.MustGet("_userID").(uint)
	user := &data.User{ID: userID}

	// Load the logged in user's record.
	if err := data.Single(user); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Load the related data for the user.
	account := new(data.Account)
	if err := data.Related(user, account); err != nil {
		reply.InternalServer(c, err)
		return
	}
	gateways := make([]*data.Gateway, 0)
	if err := data.Find(&gateways, "account_id = ?", account.ID); err != nil {
		reply.InternalServer(c, err)
		return
	}
	mailboxes := make([]*data.Mailbox, 0)
	if err := data.Find(&mailboxes, "account_id = ?", account.ID); err != nil {
		reply.InternalServer(c, err)
		return
	}
	pins := make([]*data.PIN, 0)
	for _, mailbox := range mailboxes {
		tmp := make([]*data.PIN, 0)
		if err := data.Find(&tmp, "mailbox_id = ?", mailbox.ID); err != nil {
			reply.InternalServer(c, err)
			return
		}
		for _, pin := range tmp {
			pins = append(pins, pin)
		}
	}
	users := make([]*data.User, 0)
	if err := data.Find(&users, "account_id = ?", account.ID); err != nil {
		reply.InternalServer(c, err)
		return
	}

	reply.OK(c, map[string]interface{}{
		"gateways":  gateways,
		"mailboxes": mailboxes,
		"pins":      pins,
		"user":      user,
		"users":     users,
	})
}

func GetLogout(c *gin.Context) {
	reply.OK(c, "OK")
}

func GetTotals(c *gin.Context) {
	userID := c.MustGet("_userID").(uint)
	user := &data.User{ID: userID}

	// Load the logged in user's record.
	if err := data.Single(user); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the account for the logged in user.
	account := &data.Account{ID: user.AccountID}
	if err := data.Single(account); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Pull the totals and return.
	totals, err := client.UserDeviceTotals(account.Token, account.Email)
	if err != nil {
		reply.BadGateway(c, err)
		return
	}

	reply.OK(c, totals)
}

func PostLogin(c *gin.Context) {
	// Validate request while binding.
	req := new(Login)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}
	fmt.Println("req:", req)
	// Try to find a matching user record by email.
	user := &data.User{Email: req.Email}
	err := data.Single(user)
	if err != nil {
		reply.Unauthorized(c, err)
		return
	}
	fmt.Println("user:", user)
	// Make sure that we have matching authentication methods.
	if (req.Google && !user.Google) || (!req.Google && user.Google) {
		err := fmt.Errorf("authentication methods do not match")
		reply.Unauthorized(c, err)
		return
	} else if req.Google && user.Google {
		// TODO: Handle Google authentication.
	} else if req.Password != "" && user.Password == "" {
		user.Password = req.Password
		if err := user.HashPassword(); err != nil {
			reply.BadRequest(c, err)
			return
		}
		if err := user.Save(); err != nil {
			reply.InternalServer(c, err)
			return
		}
	} else {
		// Verify that the password matches.
		err := auth.ComparePasswords(user.Password, req.Password)
		if err != nil {
			reply.Unauthorized(c, err)
			return
		}
	}

	// Generate a token for the user and return.
	if user.Token, err = auth.CreateToken(user.ID, user.AccountID); err != nil {
		reply.Unauthorized(c, err)
		return
	}
	fmt.Println("token:", user.Token)

	reply.OK(c, map[string]interface{}{
		"token": user.Token,
	})
}

func PostUser(c *gin.Context) {
	// Validate request while binding.
	req := new(User)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the account for the logged in user.
	accountID := c.MustGet("_accountID").(uint)
	account := &data.Account{ID: accountID}
	if err := data.Single(account); err != nil {
		reply.BadRequest(c, err)
		return
	}

	user, err := account.CreateUser(req.Name, req.Email, req.Phone)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}
	reply.OK(c, user)
}

func PutUser(c *gin.Context) {
	// Validate request while binding.
	req := new(User)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Grab the user from the database.
	user := &data.User{ID: req.ID}
	if err := data.Single(user); err != nil {
		reply.BadRequest(c, err)
	}

	// Update the user information and save to the database.
	user.Email = req.Email
	user.Name = req.Name
	user.Phone = req.Phone
	if err := user.Save(); err != nil {
		reply.InternalServer(c, err)
		return
	}
	reply.OK(c, user)
}
