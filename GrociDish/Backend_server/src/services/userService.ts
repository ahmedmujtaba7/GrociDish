// src/services/userService.ts

import pool from '../config/db';

// Find user by email
const findUserByEmail = async (email: string): Promise<any> => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
};

// Create a new user
const CreateUser = async (email: string, hashedPassword: string): Promise<any> => {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
    const result = await pool.query(query, [email, hashedPassword]);

    return result.rows[0];
};

export default {
    findUserByEmail,
    CreateUser,
};
