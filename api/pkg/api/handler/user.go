package handler

import (
	"fmt"
	"strconv"

	"github.com/dustinengle/smart-mailbox/pkg/api/reply"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/model"
	"github.com/gin-gonic/gin"
)

func DeleteUser(c *gin.Context) {
	// Get the param userID value.
	userID := c.Param("userID")
	if userID == "" {
		reply.BadRequest(c, fmt.Errorf("missing user id"))
		return
	}

	// Convert the id to uint.
	mid, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the account id.
	accountID := c.MustGet("accountID").(uint)

	// Remove the user and return OK.
	user := &model.User{
		AccountID: accountID,
		ID:        uint(mid),
	}
	if err := db.Delete(user); err != nil {
		reply.InternalServer(c, err)
		return
	}

	reply.OK(c, "OK")
}

func GetUser(c *gin.Context) {
	// Get the account id.
	accountID := c.MustGet("accountID").(uint)

	// Return a list of all users for given account.
	results := make([]*model.User, 0)
	if err := db.Find(&results, "account_id == ?", accountID); err != nil {
		reply.Unauthorized(c, err)
		return
	}

	reply.OK(c, results)
}

func PostUser(c *gin.Context) {
	// Validate and bind the request.
	req := new(User)
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

	// Insert the user into the database.
	user := &model.User{
		AccountID: req.AccountID,
		Email:     req.Email,
		Google:    req.Google,
		Name:      req.Name,
		Password:  req.Password,
		Phone:     req.Phone,
		PushToken: req.PushToken,
	}
	if err := db.Create(user); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Return the user object.
	reply.OK(c, user)
}

func PutUser(c *gin.Context) {
	// Validate and bind the request.
	req := new(User)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Get the param id.
	userID := c.Param("userID")
	if userID == "" {
		reply.BadRequest(c, fmt.Errorf("missing user id"))
		return
	}

	// Validate the account id.
	accountID := c.MustGet("accountID").(uint)
	if accountID != req.AccountID {
		reply.BadRequest(c, fmt.Errorf("account ids do not match"))
		return
	}

	// Pull the pin from the database.
	user := new(model.User)
	if err := db.First(user, "id == ?", userID); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Update the user in the database.
	user.Name = req.Name
	if err := db.Save(user); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Return OK.
	reply.OK(c, user)
}
