package common

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Authorize(c *gin.Context) {
	// TODO: validate authorization header token
	c.Next()
}

func Middleware(r *gin.Engine) {
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		//AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"DELETE", "GET", "OPTIONS", "PUT", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "Origin"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowAllOrigins:  true,
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
}
