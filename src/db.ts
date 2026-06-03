import { createPool } from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

export const conn = createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 5
});
