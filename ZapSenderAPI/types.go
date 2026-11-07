package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Instance represents a WhatsApp session
type Instance struct {
	ID          uuid.UUID `json:"id" gorm:"primary_key"`
	Name        string    `json:"name" gorm:"uniqueIndex"`
	Status      string    `json:"status" gorm:"default:'disconnected'"`
	PushName    string    `json:"pushName,omitempty"`
	CreatedAt   string    `json:"createdAt"`
	LastUpdate  string    `json:"lastUpdate"`
}

// Message represents a WhatsApp message
type Message struct {
	ID          uuid.UUID `json:"id" gorm:"primary_key"`
	InstanceID  uuid.UUID `json:"instanceId"`
	From        string    `json:"from"`
	To          string    `json:"to"`
	Content     string    `json:"content"`
	Type        string    `json:"type" gorm:"default:'text'"`
	MediaURL    string    `json:"mediaUrl,omitempty"`
	SentAt      string    `json:"sentAt"`
	Delivered   bool      `json:"delivered" gorm:"default:false"`
	Read        bool      `json:"read" gorm:"default:false"`
}

// Bot represents a bot plugin
type Bot struct {
	ID          uuid.UUID `json:"id" gorm:"primary_key"`
	Name        string    `json:"name" gorm:"uniqueIndex"`
	Description string    `json:"description"`
	Handler     string    `json:"handler"`
	Enabled     bool      `json:"enabled" gorm:"default:true"`
	CreatedAt   string    `json:"createdAt"`
}

// Webhook represents a webhook endpoint
type Webhook struct {
	ID          uuid.UUID `json:"id" gorm:"primary_key"`
	URL         string    `json:"url"`
	Secret      string    `json:"secret,omitempty"`
	Events      []string  `json:"events" gorm:"type:text[]"`
	Enabled     bool      `json:"enabled" gorm:"default:true"`
	CreatedAt   string    `json:"createdAt"`
}

// BotContext provides context for bot execution
type BotContext struct {
	Message Message
	Instance Instance
}

// BotResponse represents bot output
type BotResponse struct {
	Ignore bool
	Messages []Message
	Data map[string]interface{}
}

// CreateInstance creates a new WhatsApp instance
func CreateInstance(c *gin.Context) {
	var instance Instance
	if err := c.BindJSON(&instance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	instance.ID = uuid.New()
	instance.Name = "instance_" + uuid.New().String()[:8]
	instance.Status = "connecting"

	// TODO: Initialize WhatsApp connection
	// TODO: Generate QR code

	c.JSON(http.StatusCreated, instance)
}

// GetInstance retrieves a WhatsApp instance
func GetInstance(c *gin.Context) {
	instanceID := c.Param("id")
	// TODO: Fetch from database
	c.JSON(http.StatusOK, gin.H{
		"id":       instanceID,
		"status":   "connected",
		"pushName": "User Device",
	})
}

// DeleteInstance removes a WhatsApp instance
func DeleteInstance(c *gin.Context) {
	instanceID := c.Param("id")
	// TODO: Disconnect and cleanup
	c.JSON(http.StatusOK, gin.H{
		"message": "Instance " + instanceID + " deleted",
	})
}

// GetQRCode generates QR code for instance
func GetQRCode(c *gin.Context) {
	instanceID := c.Param("id")
	// TODO: Generate QR code using whatsmeow
	c.Data(http.StatusOK, "image/png", []byte("placeholder-qr"))
}