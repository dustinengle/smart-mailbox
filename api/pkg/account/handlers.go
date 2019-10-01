package account

import (
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
)

func GetAccount(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "GetAccount"})
}

func GetBalance(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "GetBalance"})
}

func GetMessages(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "GetMessages"})
}

func PostRegister(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PostRegister"})
}
