package responses

import "go.mongodb.org/mongo-driver/bson/primitive"

type Ids[IdType primitive.ObjectID | interface{}] struct {
	Ids []IdType `json:"ids"`
}