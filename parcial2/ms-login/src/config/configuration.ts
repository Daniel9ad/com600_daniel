export default () => ({
  port: parseInt(process.env.PORT || "8080", 10),
  mode: process.env.MODE_ENV || "development",
  docs: process.env.API_DOC_ENABLED === 'true' || false,
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || "60", 10) ,
    limit: parseInt(process.env.THROTTLE_LIMIT || "10", 10),
  },
  database: {
    type: process.env.DB_TYPE as "mysql" | "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migration: process.env.DB_MIGRATION === 'true' || false,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    roundSecured: parseInt(process.env.JWT_ROUNDS_SECURITY || "10", 10),
  }
});