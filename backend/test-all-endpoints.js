import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8082/api';

async function testEndpoint(name, url, options = {}) {
    try {
        console.log(`🧪 Testing ${name}...`);
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✅ ${name}: SUCCESS`);
            if (data.data) {
                console.log(`   📊 Count: ${data.count || data.data.length}`);
            }
        } else {
            console.log(`❌ ${name}: FAILED - ${data.message}`);
        }
        return data;
    } catch (error) {
        console.log(`❌ ${name}: ERROR - ${error.message}`);
    }
}

async function runAllTests() {
    console.log('🚀 Running API Tests...\n');

    // Test 1: Get all books
    await testEndpoint('Get All Books', `${BASE_URL}/books`);

    // Test 2: Get genres
    await testEndpoint('Get Genres', `${BASE_URL}/books/genres/all`);

    // Test 3: Get random books
    await testEndpoint('Get Random Books', `${BASE_URL}/books/random/3`);

    // Test 4: Get mechanical books
    await testEndpoint('Get Mechanical Books', `${BASE_URL}/books/genre/Mechanical`);

    // Test 5: Create student
    const studentData = await testEndpoint('Create Student', `${BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            studentId: "S12345",
            name: "John Doe",
            email: "john.doe@college.edu",
            department: "Computer Science",
            year: "2nd Year"
        })
    });

    // Test 6: Get active borrows (should be empty initially)
    await testEndpoint('Get Active Borrows', `${BASE_URL}/borrow/active`);

    console.log('\n🎉 All tests completed!');
}

runAllTests();