const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  titulo: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  editorial: {
    type: String,
    required: true,
  },
  anio: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  numeroPagina: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Libro', libroSchema);