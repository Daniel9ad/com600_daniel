package repositories

import (
	"context"
	"ms-habitacion/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type HabitacionRepository struct {
	collection *mongo.Collection
}

func NewHabitacionRepository(db *mongo.Database) *HabitacionRepository {
	return &HabitacionRepository{
		collection: db.Collection("habitaciones"),
	}
}

func (r *HabitacionRepository) Create(habitacion *models.Habitacion) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	habitacion.ID = primitive.NewObjectID()
	habitacion.CreatedAt = time.Now()
	habitacion.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(ctx, habitacion)
	return err
}

func (r *HabitacionRepository) FindAll() ([]models.Habitacion, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var habitaciones []models.Habitacion
	if err := cursor.All(ctx, &habitaciones); err != nil {
		return nil, err
	}

	return habitaciones, nil
}

func (r *HabitacionRepository) FindByID(id string) (*models.Habitacion, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var habitacion models.Habitacion
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&habitacion)
	if err != nil {
		return nil, err
	}

	return &habitacion, nil
}

func (r *HabitacionRepository) Update(habitacion *models.Habitacion) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	habitacion.UpdatedAt = time.Now()

	filter := bson.M{"_id": habitacion.ID}
	update := bson.M{"$set": habitacion}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}

func (r *HabitacionRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}