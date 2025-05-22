package handlers

import (
	"net/http"
	"strconv"

	"ms-eventos/models"
	"ms-eventos/repositories"

	"github.com/gin-gonic/gin"
)

type EventHandler struct {
	repo *repositories.EventRepository
}

func NewEventHandler(repo *repositories.EventRepository) *EventHandler {
	return &EventHandler{repo: repo}
}

func (h *EventHandler) CreateEvent(c *gin.Context) {
	var event models.Event

	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.Create(&event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el evento"})
		return
	}

	c.JSON(http.StatusCreated, event.ToResponse())
}

func (h *EventHandler) GetAllEvents(c *gin.Context) {
	events, err := h.repo.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener los eventos"})
		return
	}

	response := make([]models.EventResponse, len(events))
	for i, event := range events {
		response[i] = event.ToResponse()
	}

	c.JSON(http.StatusOK, response)
}

func (h *EventHandler) GetEventByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	event, err := h.repo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Evento no encontrado"})
		return
	}

	c.JSON(http.StatusOK, event.ToResponse())
}

func (h *EventHandler) UpdateEvent(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	event, err := h.repo.FindByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Evento no encontrado"})
		return
	}

	if err := c.ShouldBindJSON(event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.Update(event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el evento"})
		return
	}

	c.JSON(http.StatusOK, event.ToResponse())
}

func (h *EventHandler) DeleteEvent(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el evento"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Evento eliminado correctamente"})
}