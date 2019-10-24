package handler

import (
	"fmt"

	"github.com/dustinengle/smart-mailbox/pkg/api/reply"
	"github.com/dustinengle/smart-mailbox/pkg/client"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/model"
	"github.com/gin-gonic/gin"
)

func GetBalance(c *gin.Context) {
	// Load account id for account request.
	accountID := c.MustGet("accountID").(uint)

	// Load the account from the database.
	account := &model.Account{
		ID: accountID,
	}
	if err := db.Single(account); err != nil {
		reply.Unauthorized(c, err)
		return
	}

	// Request the balance from StreamIOT.
	balance, err := client.UserBalance(account.Token, account.Email)
	if err != nil {
		reply.BadGateway(c, err)
		return
	}
	fmt.Printf("BALANCE: %s\n", balance)

	// Return the balance map.
	reply.OK(c, balance)
}

func GetTotal(c *gin.Context) {
	// Load account id for account request.
	accountID := c.MustGet("accountID").(uint)

	// Load the account from the database.
	account := &model.Account{
		ID: accountID,
	}
	if err := db.Single(account); err != nil {
		reply.Unauthorized(c, err)
		return
	}

	// Request the device totals from StreamIOT.
	totals, err := client.UserDeviceTotals(account.Token, account.Email)
	if err != nil {
		reply.BadGateway(c, err)
		return
	}
	fmt.Printf("TOTALS: %s\n", totals)

	// Return the balance map.
	reply.OK(c, totals)
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

	}

	// Create the account locally.
	account := &model.Account{
		Email:    req.Email,
		Password: req.Password,
	}
	if err := db.Create(account); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Create a new account in StreamIOT.
	if err := client.UserRegister(req.Email, req.Password); err != nil {
		if err := db.Delete(account); err != nil {
			fmt.Printf("ERROR: unable to delete temporary account: %d\n", account.ID)
		}
		reply.BadGateway(c, err)
		return
	}

	// Login to get credentials for usage with registration.
	accountToken, err := client.UserLogin(req.Email, req.Password)
	if err != nil {
		reply.BadGateway(c, err)
		return
	}
	account.Token = accountToken.Token
	c.Set("accountToken", account.Token)

	// Load the public key, token, and save to db.
	balance, err := client.UserBalance(account.Token, req.Email)
	if err != nil {
		fmt.Printf("ERROR: unable to get account balance: %s\n", balance)
	}

	// Save the updated account information.
	if err = db.Save(account); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Create a user in the account.
	user := &model.User{
		AccountID: account.ID,
		Email:     req.Email,
		Google:    req.Google,
		Name:      req.Name,
		Password:  req.Password,
		PushToken: req.PushToken,
	}
	if err = db.Create(user); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Generate a login token.
	token, err := createToken(user.ID, user.AccountID)
	if err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Update the token on the user.
	user.Token = token
	if err = db.Save(user); err != nil {
		reply.InternalServer(c, err)
		return
	}

	reply.OK(c, map[string]interface{}{
		"account": account,
		"token":   token,
		"user":    user,
	})
}
