const { EntitySchema } = require("typeorm");

module.exports.Factura = new EntitySchema({
  name: "Facturas",
  tableName: "facturas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    clienteId: {
        type: "int",
        nullable: false,
    },
  },
  relations: {
    // Muchas facturas pertenecen a un cliente
    cliente: {
      type: "many-to-one",
      target: "Clientes",
      joinColumn: { name: "clienteId" },
      onDelete: "RESTRICT",
    },
    // Una factura tiene muchos detalles
    detalles: {
      type: "one-to-many",
      target: "DetallesFactura",
      inverseSide: "factura",
      cascade: true, 
    }
  }
});