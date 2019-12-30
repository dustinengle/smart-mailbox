package v1

import (
	h "github.com/dustinengle/itshere/pkg/v1/handler"
	mw "github.com/dustinengle/itshere/pkg/v1/middleware"
	"github.com/gin-gonic/gin"
)

func routes(r *gin.Engine) {
	mw.General(r)

	v1 := r.Group("/v1")
	{
		v1.POST("/activate/", mw.AuthorizeGateway, h.PostActivate)
		v1.POST("/connect/", mw.AuthorizeGateway, h.PostConnect)
		v1.POST("/login/", h.PostLogin)
		v1.POST("/register/", h.PostRegister)

		gw := v1.Group("/gateway/")
		{
			gw.Use(mw.AuthorizeUser)
			gw.POST("/", h.PostGateway)
			gw.PUT("/", h.PutGateway)
			gw.DELETE("/", h.DeleteGateway)
		}

		mb := v1.Group("/mailbox")
		{
			mb.Use(mw.AuthorizeUser)
			mb.DELETE("/pin/", h.DeletePIN)
			mb.DELETE("/", h.DeleteMailbox)
			mb.POST("/message/", h.PostMessage)
			mb.POST("/pin/", h.PostPIN)
			mb.POST("/", h.PostMailbox)
			mb.PUT("/", h.PutMailbox)
		}

		us := v1.Group("/user")
		{
			us.Use(mw.AuthorizeUser)
			us.GET("/balance/", h.GetBalance)
			us.GET("/details/", h.GetDetails)
			us.GET("/logout/", h.GetLogout)
			us.GET("/totals/", h.GetTotals)
			us.POST("/", h.PostUser)
			us.PUT("/", h.PutUser)
			us.DELETE("/", h.DeleteUser)
		}
	}
}

func Run(addr string) (err error) {
	r := gin.New()
	routes(r)

	err = r.Run(addr)
	return
}
