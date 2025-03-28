const express = require('express');
const connectDB = require('./db');
const tareaRoutes = require('./routes/tareas');

const app = express();

connectDB();

app.use(express.json());

app.use('/tareas', tareaRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});