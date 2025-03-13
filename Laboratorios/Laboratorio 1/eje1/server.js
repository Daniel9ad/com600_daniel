const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/calcular', (req, res) => {
  const { operacion, a, b } = req.body;
  let resultado;

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  switch (operacion) {
    case 'sumar':
      resultado = numA + numB;
      break;
    case 'restar':
      resultado = numA - numB;
      break;
    case 'multiplicar':
      resultado = numA * numB;
      break;
    case 'dividir':
      if (numB === 0) {
        resultado = 'No se puede dividir por cero';
      } else {
        resultado = numA / numB;
      }
      break;
    default:
      resultado = 'Operación no válida';
  }

  res.json({
    resultado,
    expresion: `${a} ${getSimbolo(operacion)} ${b}`
  });
});

function getSimbolo(operacion) {
  switch (operacion) {
    case 'sumar': return '+';
    case 'restar': return '-';
    case 'multiplicar': return '×';
    case 'dividir': return '÷';
    default: return '';
  }
}

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});