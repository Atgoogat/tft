package config

import (
	"context"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewMongoClient() (*mongo.Client, error) {
	ctx := context.Background()
	client, err :=  mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("TFT_MONGO_URL")).SetAuth(options.Credential{
		Username: os.Getenv("TFT_MONGO_USER"),
		Password: os.Getenv("TFT_MONGO_PASSWORD"),
	}))
	if err != nil {
		return nil, err
	}
	
	ctx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, err
	}
	return client, nil
}
