import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        enum: ['Mechanical', 'Electrical', 'Business', 'Non-Fiction', 'Fiction', 'Science', 'Technology', 'Arts'],
        default: 'Non-Fiction'
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true // Allows null values but ensures uniqueness for non-null values
    },
    imageUrl: {
        type: String,
        default: '/images/default-book-cover.jpg'
    },
    description: {
        type: String,
        default: 'No description available.'
    },
    totalCopies: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    availableCopies: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    location: {
        type: String,
        default: 'Main Library - Shelf A'
    },
    publishedYear: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear()
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;