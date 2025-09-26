import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
    },
    fineAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Generate unique token before saving
borrowRecordSchema.pre('save', async function(next) {
    if (!this.token) {
        this.token = 'LIB' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    
    // Set due date to 14 days from borrow date
    if (!this.dueDate) {
        const due = new Date(this.borrowDate);
        due.setDate(due.getDate() + 14);
        this.dueDate = due;
    }
    
    next();
});

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

export default BorrowRecord;