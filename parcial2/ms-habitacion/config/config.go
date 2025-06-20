package config

import (
	"context"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Config struct {
	MongoURI     string
	DatabaseName string
	JWTSecret    string
	ServerPort   string
}

func LoadConfig() *Config {
	// Carga variables de entorno desde archivo .env
	godotenv.Load()

	return &Config{
		MongoURI:     getEnv("MONGO_URI", "mongodb://localhost:27017"),
		DatabaseName: getEnv("DATABASE_NAME", "eventos_service"),
		JWTSecret:    getEnv("JWT_SECRET", "supersecretkey123456789"),
		ServerPort:   getEnv("SERVER_PORT", "3001"),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func SetupDatabase(cfg *Config) (*mongo.Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		return nil, err
	}

	// Verificar la conexión
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}

	db := client.Database(cfg.DatabaseName)
	return db, nil
}