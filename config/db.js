const sql = require('mssql');
require('dotenv').config({ path: 'config.env' });

const dbConnect = async () => {
    try {
        const pool = await sql.connect({
            server: process.env.DB_SERVER,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            options: {
                encrypt: true,
                trustServerCertificate: true,
            }
        });

        console.log('Base de datos conectada')
        return pool;
    } catch (error) {
        console.error('Error al conectar:', error);
        process.exit(1);
    }
    
};

module.exports = dbConnect;