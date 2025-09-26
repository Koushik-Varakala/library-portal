import express from 'express';
import {
    getBooks, 
    getBookById, 
    getBooksByGenre, 
    getRandomBooks, 
    getGenres,
    searchBooks
} from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/genres/all', getGenres);
router.get('/genre/:genre', getBooksByGenre);
router.get('/random/:count', getRandomBooks);
router.get('/search/:query', searchBooks);
router.get('/:id', getBookById);

export default router;