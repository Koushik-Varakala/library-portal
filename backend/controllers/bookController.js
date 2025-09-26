import Book from '../models/Book.js';
import BorrowRecord from '../models/BorrowRecord.js';
import Waitlist from '../models/Waitlist.js';

// @desc    Get all books with filtering and pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const { genre, search, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (genre && genre !== 'all') {
            query.genre = genre;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        const books = await Book.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ title: 1 });

        const total = await Book.countDocuments(query);

        res.json({
            success: true,
            count: books.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: books
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ 
                success: false, 
                message: 'Book not found' 
            });
        }

        const activeBorrows = await BorrowRecord.find({ 
            book: req.params.id, 
            status: 'active' 
        }).populate('student', 'name studentId');

        const waitlist = await Waitlist.find({ 
            book: req.params.id 
        }).populate('student', 'name studentId').sort({ position: 1 });

        res.json({
            success: true,
            data: {
                ...book._doc,
                currentlyBorrowedBy: activeBorrows,
                waitlist: waitlist
            }
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid book ID format' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get books by genre
// @route   GET /api/books/genre/:genre
// @access  Public
const getBooksByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!genre) {
            return res.status(400).json({ 
                success: false, 
                message: 'Genre parameter is required' 
            });
        }

        const books = await Book.find({ 
            genre: genre,
            availableCopies: { $gt: 0 }
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ title: 1 });

        const total = await Book.countDocuments({ 
            genre: genre,
            availableCopies: { $gt: 0 } 
        });

        res.json({
            success: true,
            count: books.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: books
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get random books for games
// @route   GET /api/books/random/:count
// @access  Public
const getRandomBooks = async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 5;
        
        if (count <= 0 || count > 20) {
            return res.status(400).json({ 
                success: false, 
                message: 'Count must be between 1 and 20' 
            });
        }
        
        const books = await Book.aggregate([
            { $match: { availableCopies: { $gt: 0 } } },
            { $sample: { size: count } }
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

// @desc    Get all available genres
// @route   GET /api/books/genres/all
// @access  Public
const getGenres = async (req, res) => {
    try {
        const genres = await Book.distinct('genre');
        res.json({
            success: true,
            count: genres.length,
            data: genres.sort()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Search books by title or author
// @route   GET /api/books/search/:query
// @access  Public
const searchBooks = async (req, res) => {
    try {
        const { query } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!query) {
            return res.status(400).json({ 
                success: false, 
                message: 'Search query is required' 
            });
        }

        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ title: 1 });

        const total = await Book.countDocuments({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } }
            ]
        });

        res.json({
            success: true,
            count: books.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            query: query,
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
    getBooks, 
    getBookById, 
    getBooksByGenre, 
    getRandomBooks, 
    getGenres,
    searchBooks
};