package reply

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Reply struct {
	Error  string      `json:"error,omitempty"`
	Result interface{} `json:"result,omitempty"`
}

func BadGateway(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusBadGateway, Reply{
		Error: err.Error(),
	})
}

func BadRequest(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusBadRequest, Reply{
		Error: err.Error(),
	})
}

func InternalServer(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusInternalServerError, Reply{
		Error: err.Error(),
	})
}

func OK(c *gin.Context, result interface{}) {
	c.AbortWithStatusJSON(http.StatusOK, Reply{
		Result: result,
	})
}

func Unauthorized(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, Reply{
		Error: err.Error(),
	})
}
