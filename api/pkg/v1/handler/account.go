package handler

import (
	"github.com/dustinengle/itshere/pkg/auth"
	"github.com/dustinengle/itshere/pkg/client"
	"github.com/dustinengle/itshere/pkg/data"
	"github.com/dustinengle/itshere/pkg/v1/reply"
	"github.com/gin-gonic/gin"
)

func GetBalance(c *gin.Context) {
	// Get the logged in user account.
	accountID := c.MustGet("_accountID").(uint)
	account := &data.Account{ID: accountID}
	if err := data.Single(account); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the balance.
	balance, err := client.UserBalance(account.Token, account.Email)
	if err != nil {
		reply.BadGateway(c, err)
		return
	}

	reply.OK(c, balance)
}

func PostRegister(c *gin.Context) {
	// Bind and validate request.
	req := new(Register)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// If OAuth2, validate password/token.
	if req.Google {
		// TODO: finish!
	}

	// Create the account locally.
	account, err := data.NewAccount(req.Email, req.Password)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Create a user in the account.
	user, err := account.CreateUser(req.Name, req.Email, req.Phone)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}
	user.Google = req.Google
	user.Password = req.Password
	user.PushToken = req.PushToken

	// Hash the user password.
	if err = user.HashPassword(); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Generate a login token.
	if user.Token, err = auth.CreateToken(user.ID, user.AccountID); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Save the user to the database.
	if err = user.Save(); err != nil {
		reply.InternalServer(c, err)
		return
	}

	reply.OK(c, user)
}
