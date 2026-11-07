package main

import (
	"html/template"
	"log"
	"os"
	"time"

	"gin.org/gin"
	"github.com/gin-contrib/cors"
)

// Core colors for ZapSenderAPI
const (
	ColorPrimary   = "#FF4500" // Laranja derretido
	ColorSecondary = "#000000" // Preto profundo
	ColorAccent    = "#FFA500" // Laranja vibrante
)

func main() {
	// Initialize Gin router
	r := gin.New()
	r.SetTrustedPlatformList(nil)
	r.Use(gin.LoggerWithWriter(gin.DefaultWriter, "/tmp/api.log"))
	r.Use(gin.Recovery())

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Serve static assets
	r.Static("/static", "./public")
	r.LoadHTMLGlob("public/*.html")

	// API Routes
	api := r.Group("/api/v1")
	api.Use(AuthMiddleware())
	{
		// Instance Management
		instances := api.Group("/instances")
		{
			instances.POST("", CreateInstance)
			instances.GET("/:id", GetInstance)
			instances.DELETE("/:id", DeleteInstance)
			instances.GET("/:id/qr", GetQRCode)
		}

		// Message Sending
		api.POST("/messages", SendMessage)
		api.POST("/messages/bulk", SendBulkMessages)

		// Bot Management
		bots := api.Group("/bots")
		{
			bots.POST("", RegisterBot)
			bots.GET("", ListBots)
			bots.DELETE("/:name", UnregisterBot)
			bots.POST("/:name/test", TestBot)
		}

		// Webhook Management
		webhooks := api.Group("/webhooks")
		{
			webhooks.POST("", RegisterWebhook)
			webhooks.GET("", ListWebhooks)
			webhooks.POST("/test", TestWebhook)
			webhooks.DELETE("/:id", DeleteWebhook)
		}
	}

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "ok",
			"service":   "ZapSenderAPI",
			"version":   "1.0.0",
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	// Swagger UI
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFunc))

	// Start server
	port := getEnv("SERVER_PORT", "8080")
	log.Printf("🚀 ZapSenderAPI started on port %s", port)
	log.Printf("🎨 Theme: Orange (#FF4500) & Black (#000000)")
	
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func setupTemplates() *template.Template {
	return template.Must(template.New("").Funcs(gin.H{
		"ColorPrimary":   ColorPrimary,
		"ColorSecondary": ColorSecondary,
		"ColorAccent":    ColorAccent,
	}).ParseGlob("public/*.html"))
}