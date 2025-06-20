package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Habitacion struct {
	ID               primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	NumeroHabitacion int                `json:"numero_habitacion" bson:"numero_habitacion" binding:"required"`
	TipoHabitacion   string             `json:"tipo_habitacion" bson:"tipo_habitacion" binding:"required"`
	PrecioPorNoche   float64            `json:"precio_por_noche" bson:"precio_por_noche" binding:"required"`
	Estado           string             `json:"estado" bson:"estado" binding:"required"`
	Descripcion      string             `json:"descripcion" bson:"descripcion"`
	CreatedAt        time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt        time.Time          `json:"updated_at" bson:"updated_at"`
}

type HabitacionResponse struct {
	ID               string    `json:"id"`
	NumeroHabitacion int       `json:"numero_habitacion"`
	TipoHabitacion   string    `json:"tipo_habitacion"`
	PrecioPorNoche   float64   `json:"precio_por_noche"`
	Estado           string    `json:"estado"`
	Descripcion      string    `json:"descripcion"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func (e *Habitacion) ToResponse() HabitacionResponse {
	return HabitacionResponse{
		ID:               e.ID.Hex(),
		NumeroHabitacion: e.NumeroHabitacion,
		TipoHabitacion:   e.TipoHabitacion,
		PrecioPorNoche:   e.PrecioPorNoche,
		Estado:           e.Estado,
		Descripcion:      e.Descripcion,
		CreatedAt:       e.CreatedAt,
		UpdatedAt:       e.UpdatedAt,
	}
}
