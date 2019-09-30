package mailbox

import (
	"github.com/dustinengle/smart-mailbox/pkg/common"
	"github.com/gin-gonic/gin"
)

func DeleteMailbox(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "DeleteMailbox"})
}

func DeletePIN(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "DeletePIN"})
}

func GetMailbox(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "GetMailbox"})
}

func PostLock(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostLock"})
}

func PostMailbox(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostMailbox"})
}

func PostPIN(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostPIN"})
}

func PostStatus(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostStatus"})
}

func PostUnlock(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PostUnlock"})
}

func PutMailbox(c *gin.Context) {
	common.ReplyOK(c, gin.H{"OK": "PutMailbox"})
}