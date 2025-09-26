import mongoose from 'mongoose';
import Book from '../models/Book.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleBooks = [
    {
        title: "Introduction to Mechanical Engineering",
        author: "Dr. John Smith",
        genre: "Mechanical",
        isbn: "978-0123456789",
        imageUrl: "/images/mechanical-1.jpg",
        description: "Comprehensive guide to mechanical engineering fundamentals.",
        totalCopies: 5,
        availableCopies: 3,
        publishedYear: 2022
    },
    {
        title: "Electrical Circuits and Systems",
        author: "Prof. Sarah Johnson",
        genre: "Electrical",
        isbn: "978-0123456790",
        imageUrl: "/images/electrical-1.jpg",
        description: "Detailed analysis of electrical circuits and system design.",
        totalCopies: 3,
        availableCopies: 2,
        publishedYear: 2021
    },
    {
        title: "Business Strategy for Beginners",
        author: "Michael Chen",
        genre: "Business",
        isbn: "978-0123456791",
        imageUrl: "/images/business-1.jpg",
        description: "Learn fundamental business strategies and applications.",
        totalCopies: 4,
        availableCopies: 4,
        publishedYear: 2023
    },
    {
        title: "The Science of Everything",
        author: "Dr. Emily Wilson",
        genre: "Science",
        isbn: "978-0123456792",
        imageUrl: "/images/science-1.jpg",
        description: "Exploring the wonders of science in everyday life.",
        totalCopies: 2,
        availableCopies: 1,
        publishedYear: 2020
    }
    // Add more sample books as needed
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing books
        await Book.deleteMany({});
        console.log('Cleared existing books');

        // Insert sample books
        await Book.insertMany(sampleBooks);
        console.log('Sample books inserted successfully');

        // Display inserted books
        const books = await Book.find({});
        console.log(`Total books in database: ${books.length}`);

        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();