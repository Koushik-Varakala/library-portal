import express from 'express';
import {
    saveGameScore,
    getStudentScores,
    getLeaderboard,
    getCounterGameBooks
} from '../controllers/gameController.js';

const router = express.Router();

router.post('/scores', saveGameScore);
router.get('/scores/student/:studentId', getStudentScores);
router.get('/leaderboard/:gameType', getLeaderboard);
router.get('/counter-books/:count', getCounterGameBooks);

export default router;