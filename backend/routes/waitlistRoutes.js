import express from 'express';
import {
    addToWaitlist,
    removeFromWaitlist,
    getWaitlistByBook,
    getWaitlistByStudent
} from '../controllers/waitlistController.js';

const router = express.Router();

router.post('/', addToWaitlist);
router.get('/book/:bookId', getWaitlistByBook);
router.get('/student/:studentId', getWaitlistByStudent);
router.delete('/:id', removeFromWaitlist);

export default router;