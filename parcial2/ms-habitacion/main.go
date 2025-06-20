package main

import (
	"log"
	"ms-habitacion/config"
	"ms-habitacion/handlers"
	"ms-habitacion/middlewares"
	"ms-habitacion/repositories"

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
	habitacionRepo := repositories.NewHabitacionRepository(db)

	// Inicializa el handler
	habitacionHandler := handlers.NewHabitacionHandler(habitacionRepo)

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
	router.GET("/habitaciones", habitacionHandler.GetAllHabitaciones)
	router.GET("/habitaciones/:id", habitacionHandler.GetHabitacionByID)

	// Grupo de rutas protegidas con JWT
	protected := router.Group("/admin")
	protected.Use(middlewares.JwtAuthMiddleware())
	{
		protected.POST("/habitaciones", middlewares.RequireAdmin(), habitacionHandler.CreateHabitacion)
		// protected.PUT("/habitaciones/:id", middlewares.RequireAdmin(), habitacionHandler.UpdateEvent)
		protected.DELETE("/habitaciones/:id", middlewares.RequireAdmin(), habitacionHandler.DeleteHabitacion)
	}

	// Iniciar el servidor
	router.Run(":" + cfg.ServerPort)
}
