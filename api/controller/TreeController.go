package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/atgoogat/tft-api/controller/responses"
	"github.com/atgoogat/tft-api/model"
)

type TreeController struct {
	TreeRepo model.TreeRepository
}


func (tc TreeController) GetAllTrees(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("content-type", "application/json")

	trees, err := tc.TreeRepo.FindAll()
	if err != nil {
		writeError(w, 500, err)
		return
	}
	json.NewEncoder(w).Encode(trees)
}

func (tc TreeController) GetTreesInRadius(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("content-type", "application/json")

	lat, lng, radius, err := parseGeoUrlParameters(req.URL.Query())
	if err != nil {
		writeError(w, 400, err)
		return
	}

	trees, err := tc.TreeRepo.FindInRadius(model.GeoJson{
		Type: "point",
		Coordinates: []float64{lng, lat},
	}, radius)
	if err != nil {
		writeError(w, 500, err)
		return
	}
	json.NewEncoder(w).Encode(trees)
} 

func parseGeoUrlParameters(urlValues url.Values) (lat, lng, radius float64, err error) {
	lat, err = strconv.ParseFloat(urlValues.Get("lat"), 64)
	if err != nil {
		return
	}
	lng, err = strconv.ParseFloat(urlValues.Get("lng"), 64)
	if err != nil {
		return
	}
	radius, err = strconv.ParseFloat(urlValues.Get("radius"), 64)
	return
}

type TreeImport struct {
	Features []TreeFeature `json:"features"`
}

type TreeFeature struct {
	Properites TreeProperties `json:"properties"`
	Geometry model.GeoJson `json:"geometry"`
}

type TreeProperties struct {
	Baumgruppe string `json:"baumgruppe"`
}

func (tc TreeController) PostImportTrees(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("content-type", "application/json")
	if req.Header.Get("X-API-KEY") != os.Getenv("TFT_ADMIN_APIKEY") {
		writeError(w, 403, fmt.Errorf("not authenticated"))
		return
	}
	
	ti := TreeImport{}
	err := json.NewDecoder(req.Body).Decode(&ti)
	if err != nil {
		writeError(w, 500, err)
		return
	}

	trees := make([]interface{}, len(ti.Features))
	for i, t := range ti.Features {
		trees[i] = mapTreeFeature(t)
	}

	res, err := tc.TreeRepo.Collection.InsertMany(context.Background(), trees)
	if err != nil {
		writeError(w, 500, err)
	}

	json.NewEncoder(w).Encode(responses.Ids[interface{}]{
		Ids: res.InsertedIDs,
	})
}

func mapTreeFeature(tf TreeFeature) model.Tree {
	return model.Tree{
		Treefamily: tf.Properites.Baumgruppe,
		Location: tf.Geometry,
	}
}

func writeError(w http.ResponseWriter, status int, err error) {
	w.WriteHeader(status)
	err = json.NewEncoder(w).Encode(responses.ErrorResponse{
		Msg: err.Error(),
	})
	if err != nil {
		panic(err)
	}
}
