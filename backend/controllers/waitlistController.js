import Waitlist from '../models/Waitlist.js';
import Book from '../models/Book.js';
import Student from '../models/Student.js';
import BorrowRecord from '../models/BorrowRecord.js';

// @desc    Add student to waitlist for a book
// @route   POST /api/waitlist
// @access  Public
const addToWaitlist = async (req, res) => {
    try {
        const { bookId, studentId } = req.body;

        if (!bookId || !studentId) {
            return res.status(400).json({
                success: false,
                message: 'Book ID and Student ID are required'
            });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (book.availableCopies > 0) {
            return res.status(400).json({
                success: false,
                message: 'Book is available for immediate borrowing. No need to join waitlist.'
            });
        }

        const existingWaitlist = await Waitlist.findOne({
            book: bookId,
            student: studentId
        });

        if (existingWaitlist) {
            return res.status(400).json({
                success: false,
                message: 'Student is already on the waitlist for this book'
            });
        }

        const existingBorrow = await BorrowRecord.findOne({
            book: bookId,
            student: studentId,
            status: 'active'
        });

        if (existingBorrow) {
            return res.status(400).json({
                success: false,
                message: 'Student already has this book borrowed'
            });
        }

        const lastPosition = await Waitlist.findOne({ book: bookId })
            .sort({ position: -1 })
            .select('position');

        const nextPosition = lastPosition ? lastPosition.position + 1 : 1;

        const waitlistEntry = await Waitlist.create({
            book: bookId,
            student: studentId,
            position: nextPosition,
            addedDate: new Date()
        });

        await waitlistEntry.populate('book', 'title author imageUrl genre');
        await waitlistEntry.populate('student', 'name studentId email');

        res.status(201).json({
            success: true,
            message: `Added to waitlist. Your position is #${nextPosition}`,
            data: waitlistEntry
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID or student ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove student from waitlist
// @route   DELETE /api/waitlist/:id
// @access  Public
const removeFromWaitlist = async (req, res) => {
    try {
        const waitlistEntry = await Waitlist.findById(req.params.id)
            .populate('book')
            .populate('student');

        if (!waitlistEntry) {
            return res.status(404).json({
                success: false,
                message: 'Waitlist entry not found'
            });
        }

        const bookId = waitlistEntry.book._id;
        const position = waitlistEntry.position;

        await Waitlist.findByIdAndDelete(req.params.id);

        await Waitlist.updateMany(
            { 
                book: bookId, 
                position: { $gt: position } 
            },
            { $inc: { position: -1 } }
        );

        res.json({
            success: true,
            message: 'Removed from waitlist successfully',
            data: {
                book: waitlistEntry.book.title,
                student: waitlistEntry.student.name,
                position: position
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid waitlist entry ID'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get waitlist for a specific book
// @route   GET /api/waitlist/book/:bookId
// @access  Public
const getWaitlistByBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const waitlist = await Waitlist.find({ book: bookId })
            .populate('student', 'name studentId email phone department year')
            .populate('book', 'title author imageUrl genre availableCopies')
            .sort({ position: 1 });

        res.json({
            success: true,
            count: waitlist.length,
            data: waitlist
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

// @desc    Get waitlist entries for a specific student
// @route   GET /api/waitlist/student/:studentId
// @access  Public
const getWaitlistByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const waitlistEntries = await Waitlist.find({ student: studentId })
            .populate('book', 'title author imageUrl genre availableCopies totalCopies')
            .sort({ addedDate: -1 });

        res.json({
            success: true,
            count: waitlistEntries.length,
            data: waitlistEntries
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

export {
    addToWaitlist,
    removeFromWaitlist,
    getWaitlistByBook,
    getWaitlistByStudent
};