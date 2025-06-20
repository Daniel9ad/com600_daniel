package utils

import (
	"errors"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

type Role struct {
    ID   string `json:"id"`
    Name string `json:"name"`
}

type JWTClaim struct {
    Sub   string   `json:"sub"`
    Email string   `json:"email"`
    Roles []Role   `json:"roles"`
    jwt.StandardClaims
}

func ValidateToken(tokenString string) (*JWTClaim, error) {
	// Quitar el prefijo "Bearer " si existe
	tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

	token, err := jwt.ParseWithClaims(
		tokenString,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JWTClaim)
	if !ok {
		return nil, errors.New("no se pudieron analizar los claims")
	}

	if claims.ExpiresAt < jwt.TimeFunc().Unix() {
		return nil, errors.New("token expirado")
	}

	return claims, nil
}
