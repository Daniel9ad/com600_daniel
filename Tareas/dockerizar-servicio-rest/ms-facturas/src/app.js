require('dotenv').config();
const express = require("express");
const connectDB = require("./database");
const facturasRoutes = require("./routes/facturaRoutes");
const swaggerDocs = require("./swagger");

const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
swaggerDocs(app);

// Rutas
app.use("/facturas", facturasRoutes);
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ms-facturas Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📄 Swagger en http://localhost:${PORT}/api-docs`);
  });
});
