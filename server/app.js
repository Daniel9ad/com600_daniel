const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db')
const app = express();
const port = 3000;

// Middleware para manejar datos en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

/// Configuramos EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/express', (req, res) => {
  res.send('Bienvenido a mi aplicación con Express');
});

app.post('/usuario', (req, res) => {
  const { nombre, edad } = req.body;
  res.send(`Usuario creado: ${nombre}, Edad: ${edad}`);
});

app.get('/formulario', (req, res) => {
  res.send(`
  <form method="POST" action="/calcular">
    <label for="num1">Número 1:</label>
    <input type="number" id="num1" name="num1">
    <br>
    <label for="num2">Número 2:</label>
    <input type="number" id="num2" name="num2">
    <br>
    <button type="submit">Calcular suma</button>
  </form>
  `);
});

app.post('/calcular', (req, res) => {
  const num1 = parseInt(req.body.num1);
  const num2 = parseInt(req.body.num2);
  const suma = num1 + num2;
  res.send(`La suma de ${num1} y ${num2} es: ${suma}`);
});

app.get('/plantillas', (req, res) => {
    const productos = [
        { nombre: 'Manzana', precio: 1.5 },
        { nombre: 'Banana', precio: 0.8 },
        { nombre: 'Naranja', precio: 1.2 }
    ];
    res.render('index', { productos });
});

//Ventas
app.get('/ventas', (req, res) => {
  res.sendFile('/bienvenido.html', { root: __dirname + '/public' });
});

app.get('ventas/listar', (req, res) => {
  db.query('SELECT id,nombre,precio,stock FROM productos', (error, productos) => {
      if (error) {
          console.log('Error al ejecutar la consulta');
          return;
      }
      res.render('listar', { productos });
  });
});

// Mostrar formulario para agregar producto
app.get('/ventas/add', (req, res) => {
  res.render('add');
});

//Guardar el producto en la base de datos
app.post('ventas/add', (req, res) => {
  const { nombre, precio, stock } = req.body;
  db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', [nombre, precio, stock], (error, resultado) => {
      if (error) {
          console.log('Error al insertar el producto');
          return;
      }
      res.redirect('ventas/listar');
  }); 
});

// Mostrar formulario para editar producto
app.get('ventas/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT id, nombre, precio, stock FROM productos WHERE id = ?', [id], (error, productos) => {
      if (error) {
          console.log('Error al ejecutar la consulta');
          return;
      }
      res.render('edit', { producto: productos[0] });
  });
});

// Actualizar el producto en la base de datos
app.post('ventas/edit/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;
  db.query('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [nombre, precio, stock, id], (error, resultado) => {
      if (error) {
          console.log('Error al actualizar el producto');
          return;
      }
      res.redirect('/listar');
  });
});

// Eliminar producto
app.get('ventas/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM productos WHERE id = ?', [id], (error, resultado) => {
      if (error) {
          console.log('Error al eliminar el producto');
          return;
      }
      res.redirect('/listar');
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});