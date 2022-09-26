package model

import (
	"context"
	"fmt"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Tree struct {
	Treefamily string  `json:"treefamily"`
	Location   GeoJson `json:"location"`
}

type TreeRepository struct {
	Collection *mongo.Collection
}

func (tr TreeRepository) FindAll() ([]Tree, error) {
	trees := []Tree{}
	cur, err := tr.Collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	err = cur.All(context.Background(), &trees)
	if err != nil {
		return nil, err
	}
	return trees, nil
}


func (tr TreeRepository) FindInRadius(point GeoJson, radius float64) ([]Tree, error) {
	if strings.ToLower(point.Type) != "point" {
		return nil, fmt.Errorf("expected an point")
	}

	trees := []Tree{}
	cur, err := tr.Collection.Find(context.Background(), bson.M{
		"location": bson.M{
			"$geoWithin": bson.M{
				"$centerSphere": []interface{}{
					[]interface{}{point.Coordinates[0], point.Coordinates[1]}, radius / 6378.137,
				},
			},
		},
	})
	if err != nil {
		return nil, err
	}
	err = cur.All(context.Background(), &trees)
	if err != nil {
		return nil, err
	}
	return trees, nil
}