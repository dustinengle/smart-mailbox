package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Reply struct {
	Error  string      `json:"error,omitempty"`
	Result interface{} `json:"result,omitempty"`
}

func ReplyError(c *gin.Context, err error, status int) {
	c.AbortWithStatusJSON(status, Reply{
		Error: err.Error(),
	})
}

func ReplyOK(c *gin.Context, result interface{}) {
	c.JSON(http.StatusOK, Reply{
		Result: result,
	})
}
