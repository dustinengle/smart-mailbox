package handler

import (
	"fmt"
	"strconv"

	"github.com/dustinengle/smart-mailbox/pkg/api/reply"
	"github.com/dustinengle/smart-mailbox/pkg/client"
	"github.com/dustinengle/smart-mailbox/pkg/db"
	"github.com/dustinengle/smart-mailbox/pkg/model"
	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
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

func PostLogin(c *gin.Context) {
	// Bind and validate request.
	req := new(Login)
	if err := c.BindJSON(req); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Pull the matching user from the database.
	user := &model.User{
		Email: req.Email,
	}
	if err := db.Single(user); err != nil {
		reply.BadRequest(c, err)
		return
	}

	fmt.Println("user:", user)
	if user.Password == "" {
		// Is user does not have a password assume that they were
		// invited and set the provided password as the user password
		// and log them in.
		user.Password = req.Password
		if err := db.Save(user); err != nil {
			reply.InternalServer(c, err)
			return
		}
	} else if req.Password != user.Password {
		// If the user has a set password then validate the provided
		// password with the one stored.
		reply.Unauthorized(c, fmt.Errorf("Unauthorized"))
		return
	} else if user.Google {
		// Validate using Google OAuth.
		// TODO: validate provided password token with email from Google.
		// For now we will just authenticate.
	}

	token, err := createToken(user.ID, user.AccountID)
	if err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Update the user token in the database.
	user.Token = token
	if err = db.Save(user); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Attempt to login and update the account token.
	account := &model.Account{
		ID: user.AccountID,
	}
	if err = db.Single(account); err != nil {
		reply.InternalServer(c, err)
		return
	}
	accountToken, err := client.UserLogin(account.Email, account.Password)
	if err != nil {
		reply.BadGateway(c, err)
		return
	}

	// Update the account token and save to the database.
	account.Token = accountToken.Token
	if err = db.Save(account); err != nil {
		reply.InternalServer(c, err)
		return
	}

	// Return the token.
	reply.OK(c, map[string]interface{}{
		"account": account,
		"token":   token,
		"user":    user,
	})
}

func PostLogout(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	user := &model.User{
		ID: userID,
	}
	if err := db.Single(user); err != nil {
		reply.BadRequest(c, err)
		return
	}
	user.Token = ""
	if err := db.Save(user); err != nil {
		reply.InternalServer(c, err)
		return
	}
	reply.OK(c, "OK")
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
		//Password:  req.Password,
		Phone:        req.Phone,
		PushToken:    req.PushToken,
		RefreshToken: uuid.NewV4().String(),
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
	user.Email = req.Email
	user.Name = req.Name
	user.Phone = req.Phone
	if err := db.Save(user); err != nil {
		reply.BadRequest(c, err)
		return
	}

	// Return OK.
	reply.OK(c, user)
}
