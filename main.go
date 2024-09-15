// main.go
package main

import (
	"best-joke-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Initialize the database
	db, err := gorm.Open(sqlite.Open("jokes.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&models.Joke{})

	// Initialize the router
	router := gin.Default()

	// Enable CORS
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Routes
	router.GET("/api/jokes", func(c *gin.Context) {
		var jokes []models.Joke
		db.Order("votes desc").Find(&jokes)
		c.JSON(http.StatusOK, jokes)
	})

	router.POST("/api/jokes", func(c *gin.Context) {
		var joke models.Joke
		if err := c.ShouldBindJSON(&joke); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		joke.Votes = 0
		db.Create(&joke)
		c.JSON(http.StatusOK, joke)
	})

	router.POST("/api/jokes/:id/vote", func(c *gin.Context) {
		id := c.Param("id")
		var joke models.Joke
		if err := db.First(&joke, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Joke not found"})
			return
		}
		var vote struct {
			Action string `json:"action"`
		}
		if err := c.ShouldBindJSON(&vote); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if vote.Action == "upvote" {
			joke.Votes++
		} else if vote.Action == "downvote" {
			joke.Votes--
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action"})
			return
		}
		db.Save(&joke)
		c.JSON(http.StatusOK, joke)
	})

	// Start the server
	router.Run(":5000")
}
