package middleware

import (
	"fmt"

	"github.com/dustinengle/itshere/pkg/auth"
	"github.com/dustinengle/itshere/pkg/data"
	"github.com/dustinengle/itshere/pkg/v1/reply"
	"github.com/gin-gonic/gin"
)

func AuthorizeGateway(c *gin.Context) {
	// Authorization: ed25519 signature of timestamp
	fmt.Println(c.Request.Header)
	c.Next()
}

func AuthorizeUser(c *gin.Context) {
	header := c.GetHeader("Authorization")
	fmt.Println("Authorization:", header)
	if header == "" {
		fmt.Println("authorization header empty")
		reply.Unauthorized(c, fmt.Errorf("Unauthorized"))
		return
	}

	_, _, userID, accountID, err := auth.ExtractJWT(header)
	if err != nil {
		reply.Unauthorized(c, fmt.Errorf("Unauthorized"))
		return
	}

	// Make sure we can fetch a valid user.
	user := &data.User{
		AccountID: accountID,
		ID:        userID,
	}
	if err = data.Single(user); err != nil {
		fmt.Printf("unable to find user with matching id(%d) and account id(%d)\n", userID, accountID)
		reply.Unauthorized(c, fmt.Errorf("Unauthorized"))
		return
	}

	c.Set("_accountID", accountID)
	c.Set("_userID", userID)
	c.Next()
}
