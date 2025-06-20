package middlewares

import (
	"ms-habitacion/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Se requiere autorización"})
			c.Abort()
			return
		}

		tokenString := authHeader
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			tokenString = authHeader[7:]
		}

		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido: " + err.Error()})
			c.Abort()
			return
		}
		// Pasa los claims al contexto
		c.Set("userID", claims.Sub)
		c.Set("userRoles", claims.Roles)
		c.Next()
	}
}

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRoles, exists := c.Get("userRoles")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No se encontró el rol del usuario"})
			c.Abort()
			return
		}

		roles, ok := userRoles.([]utils.Role)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar los roles del usuario"})
			c.Abort()
			return
		}

		hasAdmin := false
		for _, role := range roles {
			if role.Name == "admin" {
				hasAdmin = true
				break
			}
		}

		if !hasAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Se requieren permisos de administrador"})
			c.Abort()
			return
		}
		
		c.Next()
	}
}