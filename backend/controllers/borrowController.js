import BorrowRecord from '../models/BorrowRecord.js';
import Book from '../models/Book.js';
import Student from '../models/Student.js';
import Waitlist from '../models/Waitlist.js';

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Public
const borrowBook = async (req, res) => {
    try {
        const { bookId, studentId, studentDetails } = req.body;

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

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Book is not available for borrowing'
            });
        }

        let student = await Student.findOne({
            $or: [{ studentId: studentId }, { email: studentDetails?.email }]
        });

        if (!student) {
            if (!studentDetails) {
                return res.status(400).json({
                    success: false,
                    message: 'Student details are required for new students'
                });
            }

            student = await Student.create({
                studentId: studentId,
                name: studentDetails.name,
                email: studentDetails.email,
                phone: studentDetails.phone,
                department: studentDetails.department,
                year: studentDetails.year
            });
        }

        const currentBorrows = await BorrowRecord.countDocuments({
            student: student._id,
            status: 'active'
        });

        if (currentBorrows >= student.maxBooksAllowed) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${student.maxBooksAllowed} books allowed. Please return some books first.`
            });
        }

        const existingBorrow = await BorrowRecord.findOne({
            book: bookId,
            student: student._id,
            status: 'active'
        });

        if (existingBorrow) {
            return res.status(400).json({
                success: false,
                message: 'You have already borrowed this book'
            });
        }

        const borrowRecord = await BorrowRecord.create({
            book: bookId,
            student: student._id
        });

        book.availableCopies -= 1;
        await book.save();

        student.currentBooksBorrowed += 1;
        await student.save();

        await borrowRecord.populate('book');
        await borrowRecord.populate('student');

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully!',
            data: borrowRecord
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

// @desc    Get all active borrow records
// @route   GET /api/borrow/active
// @access  Public
const getActiveBorrows = async (req, res) => {
    try {
        const borrows = await BorrowRecord.find({ status: 'active' })
            .populate('book', 'title author genre imageUrl')
            .populate('student', 'name studentId email')
            .sort({ dueDate: 1 });

        res.json({
            success: true,
            count: borrows.length,
            data: borrows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Return a book
// @route   PUT /api/borrow/:id/return
// @access  Public
const returnBook = async (req, res) => {
    try {
        const borrowRecord = await BorrowRecord.findById(req.params.id)
            .populate('book')
            .populate('student');

        if (!borrowRecord) {
            return res.status(404).json({
                success: false,
                message: 'Borrow record not found'
            });
        }

        if (borrowRecord.status === 'returned') {
            return res.status(400).json({
                success: false,
                message: 'Book already returned'
            });
        }

        borrowRecord.status = 'returned';
        borrowRecord.returnDate = new Date();

        if (borrowRecord.returnDate > borrowRecord.dueDate) {
            const overdueDays = Math.ceil((borrowRecord.returnDate - borrowRecord.dueDate) / (1000 * 60 * 60 * 24));
            borrowRecord.fineAmount = overdueDays * 1;
        }

        await borrowRecord.save();

        borrowRecord.book.availableCopies += 1;
        await borrowRecord.book.save();

        borrowRecord.student.currentBooksBorrowed -= 1;
        await borrowRecord.student.save();

        res.json({
            success: true,
            message: 'Book returned successfully!',
            data: borrowRecord
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid borrow record ID'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get borrow record by ID
// @route   GET /api/borrow/:id
// @access  Public
const getBorrowRecordById = async (req, res) => {
    try {
        const borrowRecord = await BorrowRecord.findById(req.params.id)
            .populate('book')
            .populate('student');

        if (!borrowRecord) {
            return res.status(404).json({
                success: false,
                message: 'Borrow record not found'
            });
        }

        res.json({
            success: true,
            data: borrowRecord
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid borrow record ID'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    borrowBook,
    getActiveBorrows,
    returnBook,
    getBorrowRecordById
};