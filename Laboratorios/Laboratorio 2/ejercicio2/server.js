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
  db.query('SELECT * FROM users', (error, users) => {
    if (error) {
      console.log('Error al ejecutar la consulta');
      return;
    }
    res.render('listar', { users });
  });
});


app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { nombre, correo } = req.body;
  db.query('INSERT INTO users (nombre, correo, fecha) VALUES (?, ?, ?)', [nombre, correo, new Date()], (error, resultado) => {
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
  db.query('SELECT id, nombre, correo, fecha FROM users WHERE id = ?', [id], (error, users) => {
    if (error) {
      console.log('Error al ejecutar la consulta');
      return;
    }
    res.render('edit', { user: users[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, correo } = req.body;
  db.query('UPDATE users SET nombre = ?, correo = ? WHERE id = ?', [nombre, correo, id], (error, resultado) => {
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
  db.query('DELETE FROM users WHERE id = ?', [id], (error, resultado) => {
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
