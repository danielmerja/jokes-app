// models/joke.go
package models

import (
	"time"

	"gorm.io/gorm"
)

type Joke struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Content   string         `json:"content"`
	Votes     int            `json:"votes"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
