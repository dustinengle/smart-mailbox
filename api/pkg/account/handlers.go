package account

import (
	"net/http"

	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/dustinengle/smart-mailbox/pkg/user"
	"github.com/gin-gonic/gin"
)

func DeleteAccount(c *gin.Context) {
	// Read the user account id from JWT token.

	// Mark the account as deleted.

	reply.OK(c, gin.H{"OK": "DeleteAccount"})
}

func GetAccount(c *gin.Context) {
	// Read the user id from the JWT token.

	// Fetch the user from the database and return.

	reply.OK(c, gin.H{"OK": "GetAccount"})
}

func GetBalance(c *gin.Context) {
	// Return the balance of the account from streamiot.

	reply.OK(c, gin.H{"OK": "GetBalance"})
}

func PostRegister(c *gin.Context) {
	account := new(Account)
	if err := c.BindJSON(account); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	// Create an account in streamiot.

	// Save the account to the database.
	if err := db.Create(account); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	// Save the user to the database.
	user := &user.User{
		AccountID: account.ID,
		Email:     account.Email,
		Password:  account.Password,
	}
	if err := db.Create(user); err != nil {
		reply.Error(c, err, http.StatusBadRequest)
		return
	}

	// Send welcome email.

	reply.OK(c, account)
}
