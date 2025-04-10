const { EntitySchema } = require("typeorm");

module.exports.Cliente = new EntitySchema({
  name: "Clientes",
  tableName: "clientes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    ci: {
      type: "varchar",
      unique: true,
    },
    nombres: {
      type: "varchar",
    },
    apellidos: {
      type: "varchar",
    },
    sexo: {
      type: "varchar",
      length: 10,
      nullable: true,
    },
  },
  relations: {
    // Un cliente puede tener muchas facturas
    facturas: {
      type: "one-to-many",
      target: "Facturas",
      inverseSide: "cliente",
      cascade: true,
    }
  }
});