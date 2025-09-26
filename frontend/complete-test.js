// Complete application test script
const testEndpoints = [
  { name: 'Backend Server', url: 'http://localhost:8082/', method: 'GET' },
  { name: 'All Books', url: 'http://localhost:8082/api/books', method: 'GET' },
  { name: 'Genres', url: 'http://localhost:8082/api/books/genres/all', method: 'GET' },
  { name: 'Random Books', url: 'http://localhost:8082/api/books/random/3', method: 'GET' },
  { name: 'Mechanical Books', url: 'http://localhost:8082/api/books/genre/Mechanical', method: 'GET' }
];

const testBorrowFlow = async () => {
  console.log('\n🧪 Testing Borrow Flow...');
  
  // Step 1: Get a book to borrow
  const booksResponse = await fetch('http://localhost:8082/api/books');
  const booksData = await booksResponse.json();
  const availableBook = booksData.data.find(book => book.availableCopies > 0);
  
  if (!availableBook) {
    console.log('❌ No available books to test borrowing');
    return;
  }
  
  console.log(`📚 Selected book: ${availableBook.title}`);
  
  // Step 2: Create a student
  const studentData = {
    studentId: `TEST${Date.now()}`,
    name: "Test Student",
    email: `test${Date.now()}@college.edu`,
    department: "Computer Science",
    year: "3rd Year"
  };
  
  const studentResponse = await fetch('http://localhost:8082/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  
  if (!studentResponse.ok) {
    console.log('❌ Failed to create student');
    return;
  }
  
  // Step 3: Borrow the book
  const borrowData = {
    bookId: availableBook._id,
    studentId: studentData.studentId,
    studentDetails: studentData
  };
  
  const borrowResponse = await fetch('http://localhost:8082/api/borrow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(borrowData)
  });
  
  if (borrowResponse.ok) {
    const borrowResult = await borrowResponse.json();
    console.log(`✅ Borrow successful! Token: ${borrowResult.data.token}`);
  } else {
    console.log('❌ Borrow failed');
  }
};

const runTests = async () => {
  console.log('🚀 Starting Complete Application Tests\n');
  
  // Test backend endpoints
  for (const test of testEndpoints) {
    try {
      const response = await fetch(test.url, { method: test.method });
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${test.name}: SUCCESS`);
        if (data.count !== undefined) {
          console.log(`   📊 Count: ${data.count}`);
        }
      } else {
        console.log(`❌ ${test.name}: FAILED - ${data.message}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
  }
  
  // Test borrow flow
  await testBorrowFlow();
  
  console.log('\n🎉 Backend Testing Complete!');
  console.log('\n📋 Next: Manual Frontend Testing');
  console.log('1. Open http://localhost:8089 in your browser');
  console.log('2. Test each feature from the checklist');
  console.log('3. Verify data flows between frontend and backend');
};

runTests();