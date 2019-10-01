package gateway

import (
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
)

func DeleteGateway(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "DeleteGateway"})
}

func GetBalance(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "GetBalance"})
}

func GetGateway(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "GetGateway"})
}

func PostActivate(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PostActivate"})
}

func PostGateway(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PostGateway"})
}

func PutGateway(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PutGateway"})
}
