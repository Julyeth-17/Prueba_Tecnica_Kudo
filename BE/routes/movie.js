const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController')

router.post('/', movieController.CreateMovie);
router.get('/', movieController.GetMovies);
router.get('/novedades', movieController.GetNewMovies);
router.put('/vista', movieController.MovieIsWatched);
router.get('/peliculas-vistas', movieController.GetUsersWithWatchedMovies)


module.exports = router;