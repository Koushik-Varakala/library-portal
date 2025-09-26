import express from 'express';
import {
    borrowBook,
    getActiveBorrows,
    returnBook,
    getBorrowRecordById
} from '../controllers/borrowController.js';

const router = express.Router();

router.get('/active', getActiveBorrows);
router.get('/:id', getBorrowRecordById);
router.put('/:id/return', returnBook);
router.post('/', borrowBook);

export default router;