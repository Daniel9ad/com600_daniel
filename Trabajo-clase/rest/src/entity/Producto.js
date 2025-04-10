const { EntitySchema } = require("typeorm");

module.exports.Producto = new EntitySchema({
  name: "Productos",
  tableName: "productos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      unique: false,
    },
    descripcion: {
      type: "varchar",
      unique: false
    },
    marca: {
      type: "varchar",
      unique: false
    },
    stock: {
      type: "int",
    },
  },
});
