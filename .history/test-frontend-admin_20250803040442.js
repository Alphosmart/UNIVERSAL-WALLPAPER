const fetch = require('node-fetch');

async function testAdminEndpoint() {
    try {
        console.log('Testing admin login...');
        
        // Login as admin
        const loginResponse = await fetch('http://localhost:8080/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);
        
        if (!loginData.success) {
            throw new Error('Login failed');
        }
        
        // Extract the token and cookies from login response
        const token = loginData.data;
        const cookies = loginResponse.headers.get('set-cookie');
        console.log('Set-Cookie header:', cookies);
        console.log('\nGot token, making admin request...');
        
        // Make request to admin endpoint with cookies
        const response = await fetch('http://localhost:8080/api/admin/pending-seller-applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        });
        
        const data = await response.json();
        console.log('\nAdmin endpoint response:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.success && data.data.length > 0) {
            console.log('\n--- Checking data structure for frontend compatibility ---');
            const firstApp = data.data[0];
            
            console.log('\nApplication ID:', firstApp._id);
            console.log('Name:', firstApp.name);
            console.log('Email:', firstApp.email);
            console.log('Business Type (direct):', firstApp.businessType);
            console.log('Business Type (paymentDetails.taxInfo):', firstApp.paymentDetails?.taxInfo?.businessType);
            console.log('Verification Documents (direct):', firstApp.verificationDocuments?.length || 0);
            console.log('Verification Documents (paymentDetails):', firstApp.paymentDetails?.verificationDocuments?.length || 0);
            console.log('Address:', firstApp.address);
            console.log('Phone:', firstApp.phone);
            
            // Check if paymentDetails exists
            console.log('\npaymentDetails object:', firstApp.paymentDetails);
            console.log('taxInfo object:', firstApp.paymentDetails?.taxInfo);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAdminEndpoint();
