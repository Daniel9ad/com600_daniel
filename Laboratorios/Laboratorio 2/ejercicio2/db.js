const mysql = require('mysql2');

//Configurar la conexion
const conection = mysql.createConnection({
  host: 'mysql',
  user: 'mysql',
  password: '123456',
  database: 'db_users'

});

//Conectar a la base de datos
conection.connect((error) => {
  if (error) {
    console.log('Error al conectar a la base de datos');
    console.log(error);
    return;
  }
  console.log('Conectado a la base de datos');
});

module.exports = conection;