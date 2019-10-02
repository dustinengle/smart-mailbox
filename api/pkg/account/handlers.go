package account

import (
	"fmt"
	"net/http"

	"github.com/dustinengle/smart-mailbox/pkg/client"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/dustinengle/smart-mailbox/pkg/user"
	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func DeleteAccount(c *gin.Context) {
	reply.Error(c, fmt.Errorf("Forbidden"), http.StatusForbidden)
}

func GetAccount(c *gin.Context) {
	account := new(Account)
	if err := c.BindJSON(account); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	reply.OK(c, account)
}

func GetBalance(c *gin.Context) {
	account := new(Account)
	if err := c.BindJSON(account); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	balance, err := client.UserBalance(account.Token, account.Email)
	if err != nil {
		reply.Error(c, err, http.StatusBadGateway)
		return
	}

	reply.OK(c, balance)
}

func PostRegister(c *gin.Context) {
	account := new(Account)
	if err := c.BindJSON(account); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	// Create an account in streamiot.
	if err := client.UserRegister(account.Email, account.Password); err != nil {
		reply.Error(c, err, http.StatusBadGateway)
		return
	}

	// Login to get the token.
	token, err := client.UserLogin(account.Email, account.Password)
	if err != nil {
		reply.Error(c, err, http.StatusUnauthorized)
		return
	}

	account.Token = token.Token

	// Save the account to the database.
	if err := db.Create(account); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	// Save the user to the database.
	user := &user.User{
		AccountID:    account.ID,
		Email:        account.Email,
		Password:     account.Password,
		RefreshToken: uuid.NewV4().String(),
		Token:        uuid.NewV4().String(),
	}
	if err := db.Create(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	// Send welcome email.

	reply.OK(c, user)
}
