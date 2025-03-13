const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.get('/listar', (req, res) => {
  db.query('SELECT * FROM agenda', (error, productos) => {
    if (error) {
      console.log('Error al ejecutar la consulta');
      return;
    }
    res.render('listar', { productos });
  });
});


app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { nombres, apellidos, direccion, telefono } = req.body;
  db.query('INSERT INTO agenda (nombres, apellidos, direccion, telefono) VALUES (?, ?, ?, ?)', [nombres, apellidos, direccion, telefono], (error, resultado) => {
    if (error) {
      console.log(error)
      console.log('Error al insertar el producto');
      return;
    }
    res.redirect('/listar');
  });
});

app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT id, nombres, apellidos, direccion, telefono FROM agenda WHERE id = ?', [id], (error, productos) => {
    if (error) {
      console.log('Error al ejecutar la consulta');
      return;
    }
    res.render('edit', { producto: productos[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombres, apellidos, direccion, telefono } = req.body;
  const telefonoNew = parseInt(telefono);
  db.query('UPDATE agenda SET nombres = ?, apellidos = ?, direccion = ?, telefono = ? WHERE id = ?', [nombres, apellidos, direccion, telefonoNew, id], (error, resultado) => {
    if (error) {
      console.log(error)
      console.log('Error al actualizar el producto');
      return;
    }
    res.redirect('/listar');
  });
});

app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM agenda WHERE id = ?', [id], (error, resultado) => {
    if (error) {
      console.log('Error al eliminar el producto');
      return;
    }
    res.redirect('/listar');
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
