const { createConnection } = require("typeorm");
const { Cliente } = require("./entity/Cliente");
const { Producto } = require("./entity/Producto");
const { Factura } = require("./entity/Factura");
const { DetalleFactura } = require("./entity/DetalleFactura");

const connectDB = async () => {
  const maxRetries = 10; // Número máximo de intentos
  const retryDelay = 2000; // Retraso entre intentos (2 segundos)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await createConnection({
        type: "postgres",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS, // Nota: cambiaste DB_PASSWORD a DB_PASS aquí, asegúrate de que coincida con docker-compose.yml
        database: process.env.DB_NAME,
        entities: [Producto, Cliente, Factura, DetalleFactura],
        synchronize: true, // Solo para desarrollo (crea automáticamente las tablas)
      });
      console.log("Conexión a la base de datos establecida correctamente.");
      return; // Si la conexión es exitosa, salimos de la función
    } catch (error) {
      console.error(`Intento ${attempt} fallido al conectar a la base de datos:`, error.message);
      if (attempt === maxRetries) {
        console.error("No se pudo conectar a la base de datos después de varios intentos. Abortando...");
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay)); // Espera antes del siguiente intento
    }
  }
};

module.exports = connectDB;
