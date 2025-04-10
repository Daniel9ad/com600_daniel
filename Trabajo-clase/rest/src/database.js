const { createConnection } = require("typeorm");
const { Cliente } = require("./entity/Cliente");
const { Producto } = require("./entity/Producto");
const { Factura } = require("./entity/Factura");
const { DetalleFactura } = require("./entity/DetalleFactura");

const connectDB = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.DB_HOST, 
      port: 5432,
      username: process.env.DB_USER, 
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Producto, Cliente, Factura, DetalleFactura], 
      synchronize: true, // Solo para desarrollo (crea automáticamente las tablas)
    });
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
