const express = require('express');
const router = express.Router();
const Libro = require('../models/Libro');

router.get('/', async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { titulo, autor, editorial, anio, descripcion, numeroPagina } = req.body;
  const nuevoLibro = new Libro({ titulo, autor, editorial, anio, descripcion, numeroPagina });
  try {
    const libroguardado = await nuevoLibro.save();
    res.status(201).json(libroguardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    res.status(200).json(libro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put('/:id', async (req, res) => {
  const { titulo, autor, editorial, anio, descripcion, numeroPagina } = req.body;
  try {
    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      { titulo, autor, editorial, anio, descripcion, numeroPagina }
    );
    if (!libroActualizado) {
      return res.status(404).json({ message: 'Libro no encontrada' });
    }
    const libro = await Libro.findById(req.params.id);
    res.status(200).json(libro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);
    if (!libroEliminado) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;