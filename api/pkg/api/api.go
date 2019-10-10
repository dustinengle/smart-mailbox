package api

import (
	"github.com/dustinengle/smart-mailbox/pkg/api/handler"
	"github.com/dustinengle/smart-mailbox/pkg/api/middleware"
	"github.com/gin-gonic/gin"
)

var api *gin.Engine

func routes(r *gin.Engine) {
	middleware.General(r)

	// Public

	r.POST("/activate/", handler.PostActivate)
	r.POST("/login/", handler.PostLogin)
	r.POST("/register/", handler.PostRegister)

	// Private

	a := r.Group("/account")
	{
		a.Use(middleware.Authorize, middleware.AccountToken)
		a.GET("/balance/", handler.GetBalance)
		a.GET("/totals/", handler.GetTotal)
	}

	m := r.Group("/mailbox")
	{
		m.Use(middleware.Authorize, middleware.AccountToken)
		m.DELETE("/:mailboxID/pin/:pinID/", handler.DeletePIN)
		m.GET("/:mailboxID/message/", handler.GetMessages)
		m.GET("/:mailboxID/pin/", handler.GetPIN)
		m.POST("/pin/", handler.PostPIN)
		m.DELETE("/:mailboxID/", handler.DeleteMailbox)
		m.GET("/", handler.GetMailbox)
		m.POST("/", handler.PostMailbox)
		m.PUT("/:mailboxID/", handler.PutMailbox)
	}

	u := r.Group("/user")
	{
		u.Use(middleware.Authorize, middleware.AccountToken)
		u.DELETE("/:userID/", handler.DeleteUser)
		u.POST("/logout/", handler.PostLogout)
		u.GET("/", handler.GetUser)
		u.POST("/", handler.PostUser)
		u.PUT("/:userID/", handler.PutUser)
	}
}

func Run(addr string) (err error) {
	api = gin.New()
	routes(api)

	err = api.Run(addr)
	return
}
