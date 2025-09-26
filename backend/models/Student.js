import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: ['Computer Science', 'Mechanical', 'Electrical', 'Business', 'Arts', 'Science']
    },
    year: {
        type: String,
        required: true,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']
    },
    maxBooksAllowed: {
        type: Number,
        default: 3
    },
    currentBooksBorrowed: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;