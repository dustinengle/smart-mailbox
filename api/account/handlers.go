package account

import (
	"github.com/dustinengle/smart-mailbox/common"
	"github.com/gin-gonic/gin"
)

func GetBalance(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "GetBalance"})
}

func GetMessages(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "GetMessages"})
}

func PostRegister(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostRegister"})
}
