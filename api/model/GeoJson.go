package model

type GeoJson struct {
	Type string `json:"type"`
	Coordinates []float64 `json:"coordinates"`
}
