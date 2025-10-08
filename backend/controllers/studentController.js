import Student from '../models/Student.js';
import BorrowRecord from '../models/BorrowRecord.js';
import Waitlist from '../models/waitlist.js';

// @desc    Create a new student or get existing one
// @route   POST /api/students
// @access  Public
const createOrGetStudent = async (req, res) => {
    try {
        const { studentId, email, name, phone, department, year } = req.body;

        if (!studentId || !email || !name || !department || !year) {
            return res.status(400).json({
                success: false,
                message: 'Please provide studentId, email, name, department, and year'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        let student = await Student.findOne({
            $or: [{ studentId }, { email }]
        });

        if (student) {
            if (name || phone || department || year) {
                student = await Student.findByIdAndUpdate(
                    student._id,
                    {
                        ...(name && { name }),
                        ...(phone && { phone }),
                        ...(department && { department }),
                        ...(year && { year })
                    },
                    { new: true, runValidators: true }
                );
            }

            return res.json({
                success: true,
                message: 'Student found and information updated',
                data: student
            });
        }

        student = await Student.create({
            studentId,
            email,
            name,
            phone,
            department,
            year
        });

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Student with this ${field} already exists`
            });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const currentBorrows = await BorrowRecord.find({
            student: req.params.id,
            status: 'active'
        }).populate('book', 'title author imageUrl genre dueDate');

        const borrowHistory = await BorrowRecord.find({
            student: req.params.id
        })
            .populate('book', 'title author imageUrl genre')
            .sort({ borrowDate: -1 })
            .limit(20);

        const waitlistPositions = await Waitlist.find({
            student: req.params.id
        })
            .populate('book', 'title author imageUrl genre availableCopies')
            .sort({ addedDate: 1 });

        const totalBooksBorrowed = await BorrowRecord.countDocuments({
            student: req.params.id
        });

        const currentlyBorrowed = currentBorrows.length;
        const booksOnWaitlist = waitlistPositions.length;

        res.json({
            success: true,
            data: {
                student,
                statistics: {
                    totalBooksBorrowed,
                    currentlyBorrowed,
                    booksOnWaitlist,
                    maxBooksAllowed: student.maxBooksAllowed,
                    booksRemaining: student.maxBooksAllowed - currentlyBorrowed
                },
                currentBorrows,
                borrowHistory,
                waitlistPositions
            }
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

// @desc    Get student by studentId
// @route   GET /api/students/studentId/:studentId
// @access  Public
const getStudentByStudentId = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const currentBorrows = await BorrowRecord.find({
            student: student._id,
            status: 'active'
        }).populate('book', 'title author imageUrl');

        res.json({
            success: true,
            data: {
                student,
                currentBorrows
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getAllStudents = async (req, res) => {
    try {
        const { page = 1, limit = 10, department, search } = req.query;

        let query = {};

        if (department && department !== 'all') {
            query.department = department;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }

        const students = await Student.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ name: 1 });

        const total = await Student.countDocuments(query);

        const studentsWithBorrowCounts = await Promise.all(
            students.map(async (student) => {
                const currentBorrows = await BorrowRecord.countDocuments({
                    student: student._id,
                    status: 'active'
                });
                return {
                    ...student._doc,
                    currentBorrows
                };
            })
        );

        res.json({
            success: true,
            count: students.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: studentsWithBorrowCounts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    createOrGetStudent,
    getStudentById,
    getStudentByStudentId,
    getAllStudents
};
