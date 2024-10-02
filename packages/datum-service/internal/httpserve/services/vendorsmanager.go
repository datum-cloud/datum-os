package services

import (
	"net/http"
)

// optional code omitted

type Server struct{}

func NewServer() Server {
	return Server{}
}

// (GET /ping)
func (Server) GetPing(ctx echo.Context) error {
	resp := Pong{
		Ping: "pong",
	}

	return ctx.JSON(http.StatusOK, resp)
}
