export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  docs: process.env.API_DOC_ENABLED === 'true' || false,
  database: {
    type: process.env.DB_TYPE as "mysql" | "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migration: process.env.DB_MIGRATION === 'true' || false,
  },
});