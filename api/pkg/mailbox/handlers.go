package mailbox

import (
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
)

func DeleteMailbox(c *gin.Context) {
	// Delete the mailbox by id.

	reply.OK(c, gin.H{"OK": "DeleteMailbox"})
}

func DeletePIN(c *gin.Context) {
	// Delete the pin by id.

	reply.OK(c, gin.H{"OK": "DeletePIN"})
}

func GetMailbox(c *gin.Context) {
	// Return the mailbox by id.

	reply.OK(c, gin.H{"OK": "GetMailbox"})
}

func PostLock(c *gin.Context) {
	// Send a lock message to a mailbox.

	reply.OK(c, gin.H{"OK": "PostLock"})
}

func PostMailbox(c *gin.Context) {
	// Add a new mailbox to the account from request.

	reply.OK(c, gin.H{"OK": "PostMailbox"})
}

func PostMailboxes(c *gin.Context) {
	// Search and returned all.

	reply.OK(c, gin.H{"OK": "PostMailboxes"})
}

func PostPIN(c *gin.Context) {
	// Add a new pin to a mailbox defined in the request.

	reply.OK(c, gin.H{"OK": "PostPIN"})
}

func PostStatus(c *gin.Context) {
	// Post a status message to a mailbox.

	reply.OK(c, gin.H{"OK": "PostStatus"})
}

func PostUnlock(c *gin.Context) {
	// Post unlock message to a mailbox.

	reply.OK(c, gin.H{"OK": "PostUnlock"})
}

func PutMailbox(c *gin.Context) {
	// Update the mailbox from the request.

	reply.OK(c, gin.H{"OK": "PutMailbox"})
}
