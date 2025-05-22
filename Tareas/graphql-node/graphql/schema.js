const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const Libro = require('../models/Libro');

const LibroType = new GraphQLObjectType({
  name: 'Libro',
  fields: () => ({
    id: { type: GraphQLID },
    id: {
      type: GraphQLID,
      resolve(parent) {
        return parent._id;
      }
    },
    titulo: { type: new GraphQLNonNull(GraphQLString) },
    autor: { type: new GraphQLNonNull(GraphQLString) },
    editorial: { type: new GraphQLNonNull(GraphQLString) },
    anio: { type: new GraphQLNonNull(GraphQLInt) },
    descripcion: { type: new GraphQLNonNull(GraphQLString) },
    numeroPagina: { type: new GraphQLNonNull(GraphQLInt) },
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    libros: {
      type: new GraphQLList(LibroType),
      resolve(parent, args) {
        return Libro.find({});
      }
    },
    libro: {
      type: LibroType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Libro.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addLibro: {
      type: LibroType,
      args: {
        titulo: { type: new GraphQLNonNull(GraphQLString) },
        autor: { type: new GraphQLNonNull(GraphQLString) },
        editorial: { type: new GraphQLNonNull(GraphQLString) },
        anio: { type: new GraphQLNonNull(GraphQLInt) },
        descripcion: { type: new GraphQLNonNull(GraphQLString) },
        numeroPagina: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const nuevoLibro = new Libro({
          titulo: args.titulo,
          autor: args.autor,
          editorial: args.editorial,
          anio: args.anio,
          descripcion: args.descripcion,
          numeroPagina: args.numeroPagina,
        });
        return nuevoLibro.save();
      }
    },
    updateLibro: {
      type: LibroType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        titulo: { type: GraphQLString },
        autor: { type: GraphQLString },
        editorial: { type: GraphQLString },
        anio: { type: GraphQLInt },
        descripcion: { type: GraphQLString },
        numeroPagina: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const updateFields = {};
        if (args.titulo) updateFields.titulo = args.titulo;
        if (args.autor) updateFields.autor = args.autor;
        if (args.editorial) updateFields.editorial = args.editorial;
        if (args.anio) updateFields.anio = args.anio;
        if (args.descripcion) updateFields.descripcion = args.descripcion;
        if (args.numeroPagina) updateFields.numeroPagina = args.numeroPagina;
        return Libro.findByIdAndUpdate(
          args.id,
          { $set: updateFields },
          { new: true }
        );
      }
    },
    deleteLibro: {
      type: LibroType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Libro.findByIdAndDelete(args.id);
      }
    }
  }
});


// --- Exporta el Schema ---
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation // Añade las mutaciones al schema
});