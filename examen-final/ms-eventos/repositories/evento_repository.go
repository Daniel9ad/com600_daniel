package repositories

import (
	"context"
	"ms-eventos/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type EventoRepository struct {
	collection *mongo.Collection
}

func NewEventoRepository(db *mongo.Database) *EventoRepository {
	return &EventoRepository{
		collection: db.Collection("eventos"),
	}
}

func (r *EventoRepository) Create(habitacion *models.Evento) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	habitacion.ID = primitive.NewObjectID()
	habitacion.CreatedAt = time.Now()
	habitacion.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(ctx, habitacion)
	return err
}

func (r *EventoRepository) FindAll() ([]models.Evento, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var habitaciones []models.Evento
	if err := cursor.All(ctx, &habitaciones); err != nil {
		return nil, err
	}

	return habitaciones, nil
}

func (r *EventoRepository) FindByID(id string) (*models.Evento, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var habitacion models.Evento
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&habitacion)
	if err != nil {
		return nil, err
	}

	return &habitacion, nil
}

func (r *EventoRepository) Update(habitacion *models.Evento) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	habitacion.UpdatedAt = time.Now()

	filter := bson.M{"_id": habitacion.ID}
	update := bson.M{"$set": habitacion}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}

func (r *EventoRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}