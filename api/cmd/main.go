package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/atgoogat/tft-api/config"
	"github.com/atgoogat/tft-api/controller"
	"github.com/atgoogat/tft-api/middelware"
	"github.com/atgoogat/tft-api/model"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	err := config.LoadDotEnv()
	if err != nil {
		log.Println(err)
	}
	client, err := config.NewMongoClient()
	handleError(err)
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		client.Disconnect(ctx)
	}()

	treeController := controller.TreeController{
		TreeRepo: model.TreeRepository{
			Collection: client.Database("tft").Collection("tree"),
		},
	}

	baseHref := os.Getenv("TFT_BASE_HREF")
	router := mux.NewRouter().PathPrefix(baseHref).Subrouter()

	router.Use(middelware.LoggingMiddelware)
	router.Use(handlers.CORS(handlers.AllowedMethods([]string{"GET"})))

	treeRouter := router.PathPrefix("/tree").Subrouter()
	treeRouter.Path("/all").HandlerFunc(treeController.GetAllTrees).Methods("GET")
	treeRouter.Path("").HandlerFunc(treeController.GetTreesInRadius).Methods("GET")
	treeRouter.Path("/tree-import").HandlerFunc(treeController.PostImportTrees).Methods("POST").Headers("Content-Type", "application/json")
	
	log.Println("Listening on port 8080...")
	http.ListenAndServe(":8080", router)
}

func handleError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
