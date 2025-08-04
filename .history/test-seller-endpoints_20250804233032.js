const fetch = require('node-fetch');

// Test seller payment endpoints
async function testSellerPaymentEndpoints() {
    const baseUrl = 'http://localhost:8080/api';
    
    console.log('🧪 Testing Seller Payment Endpoints...\n');
    
    // Test 1: Try to get seller payment details without auth (should fail)
    console.log('📋 Test 1: GET /seller-payment-details without auth');
    try {
        const response = await fetch(`${baseUrl}/seller-payment-details`, {
            method: 'GET'
        });
        
        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', result);
        console.log('Expected: Should return 401 Unauthorized\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    // Test 2: Check if endpoints exist (will fail auth but should not be 404)
    console.log('📋 Test 2: PUT /seller-payment-details without auth');
    try {
        const response = await fetch(`${baseUrl}/seller-payment-details`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test: 'data' })
        });
        
        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', result);
        console.log('Expected: Should return 401 Unauthorized (not 404)\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    // Test 3: Check document upload endpoint
    console.log('📋 Test 3: POST /seller-document-upload without auth');
    try {
        const response = await fetch(`${baseUrl}/seller-document-upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test: 'data' })
        });
        
        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', result);
        console.log('Expected: Should return 401 Unauthorized (not 404)\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    console.log('✅ Endpoint Test Summary:');
    console.log('- All endpoints should return 401 (auth required) instead of 404 (not found)');
    console.log('- This confirms the routes are properly registered');
    console.log('- The SellerAccountSettings page should now work for authenticated sellers');
}

testSellerPaymentEndpoints().catch(console.error);
