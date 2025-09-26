import GameScore from '../models/GameScore.js';
import Book from '../models/Book.js';
import Student from '../models/Student.js';

// @desc    Save game score
// @route   POST /api/games/scores
// @access  Public
const saveGameScore = async (req, res) => {
    try {
        const { studentId, gameType, score, level, timeTaken } = req.body;

        if (!studentId || !gameType || score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Student ID, game type, and score are required'
            });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const gameScore = await GameScore.create({
            student: studentId,
            gameType,
            score,
            level: level || 1,
            timeTaken: timeTaken || 0,
            datePlayed: new Date()
        });

        await gameScore.populate('student', 'name studentId');

        res.status(201).json({
            success: true,
            message: 'Game score saved successfully!',
            data: gameScore
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get game scores for a student
// @route   GET /api/games/scores/student/:studentId
// @access  Public
const getStudentScores = async (req, res) => {
    try {
        const { studentId } = req.params;

        const scores = await GameScore.find({ student: studentId })
            .sort({ score: -1, datePlayed: -1 });

        res.json({
            success: true,
            count: scores.length,
            data: scores
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid student ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get leaderboard for a game type
// @route   GET /api/games/leaderboard/:gameType
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        const { gameType } = req.params;
        const limit = parseInt(req.query.limit) || 10;

        const leaderboard = await GameScore.find({ gameType })
            .populate('student', 'name studentId department')
            .sort({ score: -1, timeTaken: 1, datePlayed: -1 })
            .limit(limit);

        res.json({
            success: true,
            count: leaderboard.length,
            data: leaderboard
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get books for counter game
// @route   GET /api/games/counter-books/:count
// @access  Public
const getCounterGameBooks = async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;

        if (count <= 0 || count > 50) {
            return res.status(400).json({
                success: false,
                message: 'Count must be between 1 and 50'
            });
        }

        const books = await Book.aggregate([
            { $match: { imageUrl: { $exists: true, $ne: "" } } },
            { $sample: { size: count } },
            { $project: { title: 1, imageUrl: 1, _id: 1 } }
        ]);

        res.json({
            success: true,
            count: books.length,
            data: books
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    saveGameScore,
    getStudentScores,
    getLeaderboard,
    getCounterGameBooks
};