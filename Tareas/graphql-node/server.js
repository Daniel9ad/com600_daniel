const express = require('express');
const connectDB = require('./db');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');

const app = express();

connectDB();

app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Interfaz GraphiQL disponible en http://localhost:${PORT}/graphql`);
});