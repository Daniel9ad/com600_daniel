const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('formulario');
});

function getSimbolo(operacion) {
  switch (operacion) {
    case 'suma': return '+';
    case 'resta': return '-';
    case 'multiplicacion': return '×';
    case 'division': return '÷';
    default: return '';
  }
}

app.post('/generar-tabla', (req, res) => {
  const { operacion, numero, inicio, fin } = req.body;
  const num = parseInt(numero);
  const start = parseInt(inicio);
  const end = parseInt(fin);
  const operaciones = [];

  for (let i = start; i <= end; i++) {
    let resultado;
    switch (operacion) {
      case 'suma':
        resultado = num + i;
        break;
      case 'resta':
        resultado = num - i;
        break;
      case 'multiplicacion':
        resultado = num * i;
        break;
      case 'division':
        resultado = i !== 0 ? (num / i).toFixed(2) : 'No se puede dividir por cero';
        break;
      default:
        resultado = 'Operación no válida';
    }
    operaciones.push({
      a: num,
      b: i,
      operacion: getSimbolo(operacion),
      resultado
    });
  }

  res.render('tabla', { operaciones });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});