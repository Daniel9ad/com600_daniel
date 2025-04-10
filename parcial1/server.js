const express = require('express');
const connectDB = require('./db');
const libroRoutes = require('./routes/libroRoute');

const app = express();

connectDB();

app.use(express.json());

app.use('/libros', libroRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});