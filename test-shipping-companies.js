const fetch = require('node-fetch');

async function testShippingCompanies() {
    try {
        console.log('Testing shipping companies endpoint...');
        
        const response = await fetch('http://localhost:8080/api/admin/shipping-companies', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc3ODIzZTQ5MzlkZDBiN2Y0M2EwYWMiLCJlbWFpbCI6ImFscGhvNGx1dkBnbWFpbC5jb20iLCJpYXQiOjE3MjQ4NTcxNzZ9.wP0CzCGZKqCkJbqyiTSdGPNJVAf1LnHoW2fJqTpyuBw'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log('Response data:', JSON.stringify(data, null, 2));
            console.log('Number of shipping companies:', data.data ? data.data.length : 'No data field');
        } else {
            const errorText = await response.text();
            console.log('Error response:', errorText);
        }
    } catch (error) {
        console.error('Error testing endpoint:', error);
    }
}

testShippingCompanies();
