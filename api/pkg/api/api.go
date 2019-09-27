package api

import (
	"github.com/dustinengle/smart-mailbox/pkg/account"
	"github.com/dustinengle/smart-mailbox/pkg/common"
	"github.com/dustinengle/smart-mailbox/pkg/gateway"
	"github.com/dustinengle/smart-mailbox/pkg/mailbox"
	"github.com/dustinengle/smart-mailbox/pkg/user"
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
		a.GET("/", account.GetAccount)
	}

	g := r.Group("/gateway")
	{
		g.Use(common.Authorize)
		g.GET("/balance", gateway.GetBalance)
		g.DELETE("/", gateway.DeleteGateway)
		g.GET("/", gateway.GetGateway)
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
		m.GET("/", mailbox.GetMailbox)
		m.POST("/", mailbox.PostMailbox)
		m.PUT("/", mailbox.PutMailbox)
	}

	u := r.Group("/user")
	{
		u.Use(common.Authorize)
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
