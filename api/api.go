package api

import (
	"github.com/dustinengle/smart-mailbox/account"
	"github.com/dustinengle/smart-mailbox/common"
	"github.com/dustinengle/smart-mailbox/gateway"
	"github.com/dustinengle/smart-mailbox/mailbox"
	"github.com/dustinengle/smart-mailbox/user"
	"github.com/gin-gonic/gin"
)

var api *gin.Engine

func routes(r *gin.Engine) {
	common.Middleware(r)

	// Public

	r.POST("/activate", gateway.PostActivate)
	r.POST("/login", user.PostLogin)
	r.POST("/oauth", user.PostOAuth)
	r.POST("/register", account.PostRegister)

	// Private

	a := r.Group("/account")
	{
		a.Use(common.Authorize)
		a.GET("/balance", account.GetBalance)
		a.GET("/messages", account.GetMessages)
	}

	g := r.Group("/gateway")
	{
		g.Use(common.Authorize)
		g.GET("/balance", gateway.GetBalance)
		g.DELETE("/", gateway.DeleteGateway)
		g.POST("/", gateway.PostGateway)
		g.PUT("/", gateway.PutGateway)
	}

	m := r.Group("/mailbox")
	{
		m.Use(common.Authorize)
		m.POST("/lock", mailbox.PostLock)
		m.DELETE("/pin", mailbox.DeletePIN)
		m.POST("/pin", mailbox.PostPIN)
		m.POST("/status", mailbox.PostStatus)
		m.POST("/unlock", mailbox.PostUnlock)
		m.DELETE("/", mailbox.DeleteMailbox)
		m.POST("/", mailbox.PostMailbox)
		m.PUT("/", mailbox.PutMailbox)
	}

	u := r.Group("/user")
	{
		u.Use(common.Authorize)
		u.DELETE("/", user.DeleteUser)
		u.POST("/", user.PostUser)
		u.PUT("/", user.PutUser)
	}
}

func New(addr string) (err error) {
	api = gin.New()
	routes(api)

	err = api.Run(addr)
	return
}
