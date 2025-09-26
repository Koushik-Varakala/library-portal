import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
    try {
        console.log('🔗 Attempting to connect to MongoDB Atlas...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('📊 Database Name:', mongoose.connection.name);
        console.log('🎯 Host:', mongoose.connection.host);
        
        // Close the connection
        await mongoose.connection.close();
        console.log('✅ Connection closed properly.');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('💡 Tips:');
        console.log('1. Check your MONGODB_URI in .env file');
        console.log('2. Make sure your MongoDB Atlas IP whitelist includes your current IP');
        console.log('3. Verify your database user password');
    }
}

// Run the test
testConnection();