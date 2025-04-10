require('dotenv').config();
const express = require("express");
const connectDB = require("./database");
const productoRoutes = require("./routes/productoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const facturaRoutes = require("./routes/facturaRoutes");
const swaggerDocs = require("./swagger");

const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
swaggerDocs(app);

// Rutas
app.use("/clientes", clienteRoutes);
app.use("/productos", productoRoutes);
app.use("/facturas", facturaRoutes);
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📄 Swagger en http://localhost:${PORT}/api-docs`);
  });
});
