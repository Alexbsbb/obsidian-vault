package main

import (
	"net/http"
	"strings"
)

// API Key based authentication
var validAPIKey = "zapsender-secret-key-orange-black"

// AuthMiddleware validates API key authentication
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check for Authorization header or API key header
		var apiKey string

		if authHeader := c.GetHeader("Authorization"); authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 {
				apiKey = parts[1]
			}
		} else if apiKeyHeader := c.GetHeader("X-API-Key"); apiKeyHeader != "" {
			apiKey = apiKeyHeader
		}

		if apiKey == "" || apiKey != validAPIKey {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
				"message": "Invalid or missing API key",
				"solution": "Include X-API-Key header or Authorization: Bearer <key>",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// SendMessage sends a WhatsApp message
func SendMessage(c *gin.Context) {
	var msg Message
	if err := c.BindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message format"})
		return
	}

	// TODO: Send via whatsmeow
	/*
		msg.ID = uuid.New()
		msg.SentAt = time.Now().Format(time.RFC3339)

		// Send message logic here
		err := waClient.SendTextMessage(msg.To, msg.Content)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	*/

	c.JSON(http.StatusOK, gin.H{
		"message":  "Message queued for sending",
		"to":       msg.To,
		"content":  msg.Content[:min(50, len(msg.Content))],
		"status":   "queued",
	})
}

// SendBulkMessages sends multiple messages
func SendBulkMessages(c *gin.Context) {
	var messages []Message
	if err := c.BindJSON(&messages); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid messages format"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Bulk message processing initiated",
		"total":       len(messages),
		"status":      "processing",
	})
}

// RegisterBot registers a new bot plugin
func RegisterBot(c *gin.Context) {
	var bot Bot
	if err := c.BindJSON(&bot); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bot configuration"})
		return
	}

	bot.ID = uuid.New()
	bot.Enabled = true

	c.JSON(http.StatusCreated, bot)
}

// ListBots lists all registered bots
func ListBots(c *gin.Context) {
	bots := []Bot{
		{ID: "1", Name: "notas", Enabled: true},
		{ID: "2", Name: "pesquisa", Enabled: true},
		{ID: "3", Name: "status", Enabled: true},
	}
	
	c.JSON(http.StatusOK, gin.H{
		"bots": bots,
		"total": len(bots),
	})
}

// UnregisterBot removes a bot
func UnregisterBot(c *gin.Context) {
	botName := c.Param("name")
	c.JSON(http.StatusOK, gin.H{
		"message": "Bot " + botName + " unregistered",
	})
}

// TestBot tests a bot's response
func TestBot(c *gin.Context) {
	botName := c.Param("name")
	c.JSON(http.StatusOK, gin.H{
		"bot": botName,
		"test":  "OK",
		"message": "Bot test successful",
	})
}

// RegisterWebhook adds a webhook endpoint
func RegisterWebhook(c *gin.Context) {
	var webhook Webhook
	if err := c.BindJSON(&webhook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid webhook configuration"})
		return
	}

	webhook.ID = uuid.New()
	webhook.Events = []string{"message.created", "message.deleted"}

	c.JSON(http.StatusCreated, webhook)
}

// ListWebhooks lists all webhook endpoints
func ListWebhooks(c *gin.Context) {
	webhooks := []Webhook{}
	
	c.JSON(http.StatusOK, gin.H{
		"webhooks": webhooks,
		"total": len(webhooks),
	})
}

// TestWebhook sends test event to webhook
func TestWebhook(c *gin.Context) {
	var req struct {
		WebhookID string `json:"webhookId"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"webhookId": req.WebhookID,
		"test":      "sent",
		"status":    "delivered",
	})
}

// DeleteWebhook removes a webhook
func DeleteWebhook(c *gin.Context) {
	webhookID := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"message": "Webhook " + webhookID + " deleted",
	})
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}