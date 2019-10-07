package reply

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func BadGateway(c *gin.Context, err error) {
	Error(c, err, http.StatusBadGateway)
}

func BadRequest(c *gin.Context, err error) {
	Error(c, err, http.StatusBadRequest)
}

func Error(c *gin.Context, err error, status int) {
	c.AbortWithStatusJSON(status, Reply{
		Error: err.Error(),
	})
}

func InternalServer(c *gin.Context, err error) {
	Error(c, err, http.StatusInternalServerError)
}

func Unauthorized(c *gin.Context, err error) {
	Error(c, err, http.StatusUnauthorized)
}
