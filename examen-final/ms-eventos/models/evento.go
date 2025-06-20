package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Evento struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Titulo      string             `json:"titulo" bson:"titulo"`
	Descripcion string             `json:"descripcion" bson:"descripcion"`
	Fecha       time.Time          `json:"fecha" bson:"fecha"`
	Ubicacion   string             `json:"ubicacion" bson:"ubicacion"`
	Capacidad   int                `json:"capacidad" bson:"capacidad" binding:"required"`
	Precio      float64            `json:"precio" bson:"precio_por_noche" binding:"required"`
	CreatedAt   time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at" bson:"updated_at"`
}

type EventoResponse struct {
	ID          string    `json:"id"`
	Titulo      string    `json:"titulo"`
	Descripcion string    `json:"descripcion"`
	Fecha       time.Time `json:"fecha"`
	Ubicacion   string    `json:"ubicacion"`
	Capacidad   int       `json:"capacidad"`
	Precio      float64   `json:"precio"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (e *Evento) ToResponse() EventoResponse {
	return EventoResponse{
		ID:          e.ID.Hex(),
		Titulo:      e.Titulo,
		Descripcion: e.Descripcion,
		Fecha:       e.Fecha,
		Ubicacion:   e.Ubicacion,
		Capacidad:   e.Capacidad,
		Precio:      e.Precio,
		CreatedAt:   e.CreatedAt,
		UpdatedAt:   e.UpdatedAt,
	}
}
