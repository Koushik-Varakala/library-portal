// Test connection to backend on port 8082
const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8082/api/books');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend connection successful!');
      console.log(`📚 Found ${data.count} books`);
    } else {
      console.log('❌ Backend connection failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
    console.log('💡 Make sure backend is running on port 8082');
  }
};

testBackendConnection();