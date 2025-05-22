package main

import (
	"log"
	"ms-eventos/config"
	"ms-eventos/handlers"
	"ms-eventos/middlewares"
	"ms-eventos/models"
	"ms-eventos/repositories"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Carga la configuración
	cfg := config.LoadConfig()

	// Inicializar la base de datos
	db, err := config.SetupDatabase(cfg)
	if err != nil {
		log.Fatalf("Error conectando a la base de datos: %v", err)
	}

	// Auto-migración de modelos
	db.AutoMigrate(&models.Event{})

	// Inicializa el repositorio
	eventRepo := repositories.NewEventRepository(db)

	// Inicializa el handler
	eventHandler := handlers.NewEventHandler(eventRepo)

	// Configuración del router
	router := gin.Default()

	// Configuración CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Rutas públicas
	router.GET("/eventos", eventHandler.GetAllEvents)
	router.GET("/eventos/:id", eventHandler.GetEventByID)

	// Grupo de rutas protegidas con JWT
	protected := router.Group("/admin")
	protected.Use(middlewares.JwtAuthMiddleware())
	{
		protected.POST("/eventos", middlewares.RequireAdmin(), eventHandler.CreateEvent)
		protected.PUT("/eventos/:id", middlewares.RequireAdmin(), eventHandler.UpdateEvent)
		protected.DELETE("/eventos/:id", middlewares.RequireAdmin(), eventHandler.DeleteEvent)
	}

	// Iniciar el servidor
	router.Run(":" + cfg.ServerPort)
}
