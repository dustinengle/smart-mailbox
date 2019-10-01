package user

import (
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
)

func DeleteUser(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "DeleteUser"})
}

func GetUser(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "GetUser"})
}

func PostLogin(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PostLogin"})
}

func PostOAuth(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PostOAuth"})
}

func PostUser(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PostUser"})
}

func PutUser(c *gin.Context) {
	reply.OK(c, gin.H{"OK": "PutUser"})
}
