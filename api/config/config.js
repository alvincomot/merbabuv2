import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  nodeEnv: process.env.NODE_ENV || "production", // development | production
  dbClient: process.env.DB_CLIENT || "prisma", // sequelize | prisma
};

export const sequelizeConfig = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || "db_merbabuv2",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    use_env_variable: "POSTGRES_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
