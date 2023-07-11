import "dotenv/config";

// Configuration for client connection to Postgres database
const dbConfig = {
  user: process.env.PostgresUSER,
  password: process.env.PostgresPASS,
  host: process.env.PostgresHOST,
  database: process.env.PostgresDB,
  port: process.env.PostgresPORT,
};

export default dbConfig;
