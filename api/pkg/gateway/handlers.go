package gateway

import (
	"github.com/dustinengle/smart-mailbox/pkg/reply"
	"github.com/gin-gonic/gin"
)

func DeleteGateway(c *gin.Context) {
	// Mark the gateway as deleted.

	reply.OK(c, gin.H{"OK": "DeleteGateway"})
}

func PostActivate(c *gin.Context) {
	// Activate a gateway by matchin sn returning:
	//  - channel id
	//  - device id
	//  - mailbox sn

	reply.OK(c, gin.H{"OK": "PostActivate"})
}

func PostBalance(c *gin.Context) {
	// Get the balance of the device.

	reply.OK(c, gin.H{"OK": "PostBalance"})
}

func PostGateway(c *gin.Context) {
	// Add the new gateway to the account.

	reply.OK(c, gin.H{"OK": "PostGateway"})
}

func PostGateways(c *gin.Context) {
	// Search and returned all.

	reply.OK(c, gin.H{"OK": "PostGateways"})
}

func PostMessages(c *gin.Context) {
	// Read messages for a gateway.

	reply.OK(c, gin.H{"OK": "PostMessages"})
}

func PutGateway(c *gin.Context) {
	// Update a gateway from request.

	reply.OK(c, gin.H{"OK": "PutGateway"})
}
