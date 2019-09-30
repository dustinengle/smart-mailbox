package reply

import "github.com/gin-gonic/gin"

func Error(c *gin.Context, err error, status int) {
	c.AbortWithStatusJSON(status, Reply{
		Error: err.Error(),
	})
}
