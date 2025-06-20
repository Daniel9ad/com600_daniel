package handlers

import (
	"net/http"

	"ms-habitacion/models"
	"ms-habitacion/repositories"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type HabitacionHandler struct {
	repo *repositories.HabitacionRepository
}

func NewHabitacionHandler(repo *repositories.HabitacionRepository) *HabitacionHandler {
	return &HabitacionHandler{repo: repo}
}

func (h *HabitacionHandler) CreateHabitacion(c *gin.Context) {
	var habitacion models.Habitacion

	if err := c.ShouldBindJSON(&habitacion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.Create(&habitacion); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la habitación"})
		return
	}

	c.JSON(http.StatusCreated, habitacion.ToResponse())
}

func (h *HabitacionHandler) GetAllHabitaciones(c *gin.Context) {
	habitaciones, err := h.repo.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las habitaciones"})
		return
	}

	response := make([]models.HabitacionResponse, len(habitaciones))
	for i, habitacion := range habitaciones {
		response[i] = habitacion.ToResponse()
	}

	c.JSON(http.StatusOK, response)
}

func (h *HabitacionHandler) GetHabitacionByID(c *gin.Context) {
	id := c.Param("id")

	habitacion, err := h.repo.FindByID(id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Habitación no encontrada"})
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

func (h *HabitacionHandler) DeleteHabitacion(c *gin.Context) {
	id := c.Param("id")

	if err := h.repo.Delete(id); err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Habitación no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar la habitación"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Habitación eliminada correctamente"})
}
