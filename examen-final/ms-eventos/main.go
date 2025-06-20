package main

import (
	"log"
	"ms-eventos/config"
	"ms-eventos/handlers"
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
	// db.AutoMigrate(&models.Event{})

	// Inicializa el repositorio
	eventoRepo := repositories.NewEventoRepository(db)

	// Inicializa el handler
	eventoHandler := handlers.NewEventoHandler(eventoRepo)

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
	router.GET("/eventos", eventoHandler.GetAllEventos)
	router.GET("/eventos/:id", eventoHandler.GetEventoByID)
	router.POST("/eventos", eventoHandler.CreateEvento)
	router.DELETE("/eventos/:id", eventoHandler.DeleteEvento)

	// Grupo de rutas protegidas con JWT
	// protected := router.Group("/admin")
	// protected.Use(middlewares.JwtAuthMiddleware())
	// {
	// 	protected.POST("/eventos", middlewares.RequireAdmin(), eventoHandler.CreateEvento)
	// 	// protected.PUT("/habitaciones/:id", middlewares.RequireAdmin(), habitacionHandler.UpdateEvent)
	// 	protected.DELETE("/eventos/:id", middlewares.RequireAdmin(), eventoHandler.DeleteEvento)
	// }

	// Iniciar el servidor
	router.Run(":" + cfg.ServerPort)
}
