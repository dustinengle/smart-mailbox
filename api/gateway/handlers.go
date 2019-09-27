package gateway

import (
	"github.com/dustinengle/smart-mailbox/common"
	"github.com/gin-gonic/gin"
)

func DeleteGateway(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "DeleteGateway"})
}

func GetBalance(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "GetBalance"})
}

func GetGateway(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "GetGateway"})
}

func PostActivate(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostActivate"})
}

func PostGateway(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostGateway"})
}

func PutGateway(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PutGateway"})
}
