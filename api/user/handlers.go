package user

import (
	"github.com/dustinengle/smart-mailbox/common"
	"github.com/gin-gonic/gin"
)

func DeleteUser(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "DeleteUser"})
}

func GetUser(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "GetUser"})
}

func PostLogin(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostLogin"})
}

func PostOAuth(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostOAuth"})
}

func PostUser(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostUser"})
}

func PutUser(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PutUser"})
}
