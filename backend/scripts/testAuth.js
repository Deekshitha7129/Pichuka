import axios from 'axios';

const testAuth = async () => {
  try {
    console.log('Testing authentication for chef002@pichuka.com...');
    
    const response = await axios.post('http://localhost:4000/api/v1/auth/login', {
      email: 'chef002@pichuka.com',
      password: 'chef123'
    });
    
    console.log('✅ Authentication successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Authentication failed!');
    console.log('Error:', error.response?.data || error.message);
  }
};

testAuth(); 