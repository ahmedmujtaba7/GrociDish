import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER, // PostgreSQL username
    host: 'localhost', // PostgreSQL server address
    database: process.env.DB_NAME, // PostgreSQL database name
    password: process.env.DB_PASSWORD, // PostgreSQL password
    port: 5432//Number(process.env.PG_PORT), // PostgreSQL port
});

export default pool;