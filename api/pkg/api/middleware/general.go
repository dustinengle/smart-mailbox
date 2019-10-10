package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func General(r *gin.Engine) {
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		//AllowOrigins:     []string{"*"},
		AllowMethods:    []string{"DELETE", "GET", "OPTIONS", "PUT", "PATCH"},
		AllowHeaders:    []string{"Accept", "Authorization", "Content-Type", "Origin"},
		ExposeHeaders:   []string{"Content-Length", "Content-Type"},
		AllowAllOrigins: true,
		//AllowCredentials: true,
		MaxAge: 1 * time.Hour,
	}))
}
