package models

import (
	"time"
	// "gorm.io/gorm"
)

type Event struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Nombre    string    `json:"nombre" binding:"required"`
	Fecha     time.Time `json:"fecha" binding:"required"`
	Lugar     string    `json:"lugar" binding:"required"`
	Capacidad int       `json:"capacidad" binding:"required"`
	Precio    float64   `json:"precio" binding:"required"`
}

type EventResponse struct {
	ID        uint      `json:"id"`
	Nombre    string    `json:"nombre"`
	Fecha     time.Time `json:"fecha"`
	Lugar     string    `json:"lugar"`
	Capacidad int       `json:"capacidad"`
	Precio    float64   `json:"precio"`
}

func (e *Event) ToResponse() EventResponse {
	return EventResponse{
		ID:        e.ID,
		Nombre:    e.Nombre,
		Fecha:     e.Fecha,
		Lugar:     e.Lugar,
		Capacidad: e.Capacidad,
		Precio:    e.Precio,
	}
}
