const sql = require('mssql');
const dbConnect = require('../config/db');

exports.CreateUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const pool = await dbConnect();

        await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Email', sql.NVarChar, email)
            .query('INSERT INTO Users (Name, Email) VALUES (@Name, @Email)');

        res.status(201).json({ message: 'Usuario creado exitosamente' })

    } catch (error) {
        console.error('Error al crear el usuario:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
};

// module.exports = {
//     CreateUser
// }