package middleware

import (
	"strconv"

	"github.com/dustinengle/itshere/pkg/v1/reply"
	"github.com/gin-gonic/gin"
)

func ID(param string) func(*gin.Context) {
	return func(c *gin.Context) {
		sp := c.Param(param)
		ip, err := strconv.ParseUint(sp, 10, 64)
		if err != nil {
			reply.BadRequest(c, err)
			return
		}

		c.Set(param[1:], uint(ip))
		c.Next()
	}
}
