package reply

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func OK(c *gin.Context, result interface{}) {
	c.JSON(http.StatusOK, Reply{
		Result: result,
	})
}
