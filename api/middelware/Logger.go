package middelware

import (
	"log"
	"net/http"
)

func LoggingMiddelware(next http.Handler) http.Handler {
	return http.HandlerFunc(func (w http.ResponseWriter, req *http.Request) {
		log.Println(req.Host, req.Method, req.RequestURI)
		next.ServeHTTP(w, req)
	})
}