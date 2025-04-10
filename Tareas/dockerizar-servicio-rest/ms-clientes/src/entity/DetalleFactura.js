const { EntitySchema } = require("typeorm");

module.exports.DetalleFactura = new EntitySchema({
  name: "DetallesFactura",
  tableName: "detalles_factura",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    facturaId: {
        type: "int",
        nullable: false,
    },
    productoId: {
        type: "int",
        nullable: false,
    },
    cantidad: {
      type: "int",
      nullable: false,
    },
    precio: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
  },
  relations: {
    // Muchos detalles pertenecen a una factura
    factura: {
      type: "many-to-one",
      target: "Facturas",
      joinColumn: { name: "facturaId" },
      onDelete: "CASCADE",
    },
    // Muchos detalles (líneas de venta) pueden referirse al mismo producto
    producto: {
      type: "many-to-one",
      target: "Productos",
      joinColumn: { name: "productoId" },
      onDelete: "RESTRICT",
    }
  }
});