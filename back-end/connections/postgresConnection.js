import pkg from 'pg';
const {Client} = pkg;
import 'dotenv/config';

const client = new Client({
    user: process.env.PostgresUSER,
    password: process.env.PostgresPASS,
    host: process.env.PostgresHOST,
    database: process.env.PostgresDB,
    port: process.env.PostgresPORT,
});

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL!');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL:', err);
    });

export default client;
``