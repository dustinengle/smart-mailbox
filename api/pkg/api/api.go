package api

import (
	"github.com/dustinengle/smart-mailbox/pkg/account"
	"github.com/dustinengle/smart-mailbox/pkg/gateway"
	"github.com/dustinengle/smart-mailbox/pkg/mailbox"
	"github.com/dustinengle/smart-mailbox/pkg/user"
	"github.com/gin-gonic/gin"
)

var api *gin.Engine

func routes(r *gin.Engine) {
	middleware(r)

	// Public

	r.POST("/activate", gateway.PostActivate)
	r.POST("/login", user.PostLogin)
	r.POST("/oauth", user.PostOAuth)
	r.POST("/register", account.PostRegister)

	// Private

	a := r.Group("/account")
	{
		a.Use(authorize, accountToken)
		a.GET("/balance", account.GetBalance)
		a.DELETE("/", account.DeleteAccount)
		a.GET("/", account.GetAccount)
	}

	g := r.Group("/gateway")
	{
		g.Use(authorize, accountToken)
		g.POST("/all", gateway.PostGateways)
		g.POST("/balance", gateway.PostBalance)
		g.POST("/message", gateway.PostMessage)
		g.POST("/messages", gateway.PostMessages)
		g.DELETE("/", gateway.DeleteGateway)
		g.POST("/", gateway.PostGateway)
		g.PUT("/", gateway.PutGateway)
	}

	m := r.Group("/mailbox")
	{
		m.Use(authorize, accountToken)
		m.POST("/all", mailbox.PostMailboxes)
		m.DELETE("/pin/", mailbox.DeletePIN)
		m.POST("/pin", mailbox.PostPIN)
		m.DELETE("/", mailbox.DeleteMailbox)
		m.GET("/", mailbox.GetMailbox)
		m.POST("/", mailbox.PostMailbox)
		m.PUT("/", mailbox.PutMailbox)
	}

	u := r.Group("/user")
	{
		u.Use(authorize, accountToken)
		u.DELETE("/", user.DeleteUser)
		u.GET("/", user.GetUser)
		u.POST("/", user.PostUser)
		u.PUT("/", user.PutUser)
	}
}

func Run(addr string) (err error) {
	api = gin.New()
	routes(api)

	err = api.Run(addr)
	return
}
