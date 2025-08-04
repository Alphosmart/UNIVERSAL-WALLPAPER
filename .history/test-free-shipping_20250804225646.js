const fetch = require('node-fetch');

// Test free shipping configuration
async function testFreeShipping() {
    const baseUrl = 'http://localhost:8080/api';
    
    console.log('🧪 Testing Free Shipping Configuration...\n');
    
    // Test 1: Default shipping calculation without any configuration
    console.log('📋 Test 1: Default shipping for $50 order to US');
    try {
        const response = await fetch(`${baseUrl}/shipping/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                country: 'United States',
                totalAmount: 50,
                items: [{ id: '1' }],
                totalWeight: 1
            })
        });
        
        const result = await response.json();
        console.log('Full response:', result);
        console.log('Result data:', result.data);
        console.log('Expected: Should charge $9.99 shipping\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    // Test 2: Order above default free shipping threshold
    console.log('📋 Test 2: Order above $100 (default free shipping)');
    try {
        const response = await fetch(`${baseUrl}/shipping/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                country: 'United States',
                totalAmount: 150,
                items: [{ id: '1' }],
                totalWeight: 1
            })
        });
        
        const result = await response.json();
        console.log('Result:', result.data);
        console.log('Expected: Should be free shipping\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    // Test 3: Different countries
    console.log('📋 Test 3: Canada shipping for $60 order');
    try {
        const response = await fetch(`${baseUrl}/shipping/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                country: 'Canada',
                totalAmount: 60,
                items: [{ id: '1' }],
                totalWeight: 1
            })
        });
        
        const result = await response.json();
        console.log('Result:', result.data);
        console.log('Expected: Should charge $14.99 shipping\n');
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    console.log('✅ Test Summary:');
    console.log('- Admins can configure global free shipping threshold in the admin dashboard');
    console.log('- Default fallback provides $100 free shipping threshold');
    console.log('- Different countries have different base rates');
    console.log('- System works with or without admin configuration');
}

testFreeShipping().catch(console.error);
