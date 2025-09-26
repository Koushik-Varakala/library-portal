import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testBorrow = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Test data
        const testData = {
            bookId: null, // We'll get this first
            studentId: "TEST123",
            studentDetails: {
                name: "Test Student",
                email: "test@college.edu",
                department: "Computer Science",
                year: "2nd Year"
            }
        };

        // First, get a book ID
        const Book = await import('./models/Book.js');
        const books = await Book.default.find().limit(1);
        
        if (books.length === 0) {
            console.log('❌ No books in database. Run the seed script first.');
            return;
        }

        testData.bookId = books[0]._id;
        console.log(`📚 Using book: ${books[0].title} (ID: ${testData.bookId})`);

        // Test the borrow API directly
        const response = await fetch('http://localhost:8082/api/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        
        console.log('📊 Response Status:', response.status);
        console.log('📋 Response Data:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('✅ Borrow test successful!');
        } else {
            console.log('❌ Borrow test failed with error:', result.message);
        }

        await mongoose.connection.close();
        
    } catch (error) {
        console.error('💥 Test error:', error.message);
    }
};

testBorrow();