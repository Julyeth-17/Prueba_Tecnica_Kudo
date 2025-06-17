const sql = require('mssql');
const dbConnect = require('../config/db');

exports.CreateMovie = async (req, res) => {
    const { name, description, releaseDate, categoryId } = req.body;

    if (!name || !releaseDate || !categoryId) {
        return res.status(400).json({ message: 'Campo obligatorio' })
    }

    try {
        const pool = await dbConnect()

        await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Description', sql.NVarChar, description || '')
            .input('ReleaseDate', sql.Date, releaseDate)
            .input('CategoryId', sql.Int, categoryId)
            .query(`
                INSERT INTO Movies (Name, Description, ReleaseDate, CategoryId)
                VALUES (@Name, @Description, @ReleaseDate, @CategoryId)
            `);

        res.status(201).json({ message: 'Pelicula creada exitosamente' })
    } catch (error) {
        console.error('Error al crear la pelicula:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.GetMovies = async (req, res) => {
    const { name, categoryId, page = 1, limit = 10, sort = 'desc' } = req.query;

    const offset = (page - 1) * limit;

    try {
        const pool = await dbConnect();

        let query = `
            SELECT m.Id, m.Name, m.Description, m.ReleaseDate, c.Name AS CategoryName
            FROM Movies m
            JOIN Categories c ON m.CategoryId = c.Id
            WHERE 1=1
        `;

        if (name) {
            query += ` AND m.Name LIKE @Name`;
        }

        if (categoryId) {
            query += ` AND m.CategoryId = @CategoryId`;
        }

        query += ` ORDER BY m.ReleaseDate ${sort === 'asc' ? 'ASC' : 'DESC'} OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`;

        const request = pool.request()
            .input('Name', sql.NVarChar, `%${name || ''}%`)
            .input('CategoryId', sql.Int, categoryId || 0)
            .input('Offset', sql.Int, offset)
            .input('Limit', sql.Int, parseInt(limit));

        const result = await request.query(query);

        res.json(result.recordset)

    } catch (error) {
        console.error('Error al obtener películas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

exports.GetNewMovies = async (req, res) => {
    try {
        const pool = await dbConnect();

        const result = await pool.request().query(`
            SELECT * FROM Movies
            WHERE DATEDIFF(WEEK, ReleaseDate, GETDATE()) < 3
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener novedades', error });
    }
}

exports.MovieIsWatched = async (req, res) => {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
        return res.status(400).json({ message: 'Usuario Id y/o Pelicula Id son obligatorios' });
    }

    try {
        const pool = await dbConnect();

        await pool.request()
            .input('UserId', sql.Int, userId)
            .input('MovieId', sql.Int, movieId)
            .query(`
                IF NOT EXISTS (
                    SELECT 1 FROM MoviesWatched WHERE UserId = @UserId AND MovieId = @MovieId
                )
                BEGIN
                    INSERT INTO MoviesWatched (UserId, MovieId)
                    VALUES (@UserId, @MovieId)
                END
            `);

        res.status(200).json({ message: 'Película marcada como vista' });
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar como vista', error });
    }
};

exports.GetUsersWithWatchedMovies = async (req, res) => {
    try {
        const pool = await dbConnect();

        const result = await pool.request().query(`
            SELECT U.Name AS UserName, M.Name AS MovieName, MW.WatchedDate
            FROM MoviesWatched MW
            JOIN Users U ON MW.UserId = U.Id
            JOIN Movies M ON MW.MovieId = M.Id
        `);

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar usuarios con películas vistas', error });
    }
};

