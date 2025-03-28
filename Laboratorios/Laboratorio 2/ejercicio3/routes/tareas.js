const express = require('express');
const router = express.Router();
const Tarea = require('../models/tarea');

router.get('/', async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { titulo, descripcion, estado } = req.body;
  const nuevaTarea = new Tarea({ titulo, descripcion, estado });
  try {
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { estado } = req.body;
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!tareaActualizada) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
    if (!tareaEliminada) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;