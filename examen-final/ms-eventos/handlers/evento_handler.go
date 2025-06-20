package handlers

import (
	"net/http"

	"ms-eventos/models"
	"ms-eventos/repositories"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventoHandler struct {
	repo *repositories.EventoRepository
}

func NewEventoHandler(repo *repositories.EventoRepository) *EventoHandler {
	return &EventoHandler{repo: repo}
}

func (h *EventoHandler) CreateEvento(c *gin.Context) {
	var habitacion models.Evento

	if err := c.ShouldBindJSON(&habitacion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.Create(&habitacion); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el evento"})
		return
	}

	c.JSON(http.StatusCreated, habitacion.ToResponse())
}

func (h *EventoHandler) GetAllEventos(c *gin.Context) {
	habitaciones, err := h.repo.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener los eventos"})
		return
	}

	response := make([]models.EventoResponse, len(habitaciones))
	for i, habitacion := range habitaciones {
		response[i] = habitacion.ToResponse()
	}

	c.JSON(http.StatusOK, response)
}

func (h *EventoHandler) GetEventoByID(c *gin.Context) {
	id := c.Param("id")

	habitacion, err := h.repo.FindByID(id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Evento no encontrado"})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		}
		return
	}

	c.JSON(http.StatusOK, habitacion.ToResponse())
}

// func (h *HabitacionHandler) UpdateHabitacion(c *gin.Context) {
// 	id := c.Param("id")

// 	habitacion, err := h.repo.FindByID(id)
// 	if err != nil {
// 		if err == mongo.ErrNoDocuments {
// 			c.JSON(http.StatusNotFound, gin.H{"error": "Habitación no encontrada"})
// 		} else {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
// 		}
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&habitacion); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.repo.Update(&habitacion); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la habitación"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, habitacion.ToResponse())
// }

func (h *EventoHandler) DeleteEvento(c *gin.Context) {
	id := c.Param("id")

	if err := h.repo.Delete(id); err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Evento no encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el evento"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Evento eliminado correctamente"})
}
