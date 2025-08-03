const fetch = require('node-fetch');

async function testSellerApplication() {
    try {
        console.log('Starting seller application test...\n');

        // 1. Create a test user
        console.log('1. Creating test user...');
        const signupResponse = await fetch('http://localhost:8080/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test Seller',
                email: 'testseller@example.com',
                password: 'password123'
            })
        });

        const signupData = await signupResponse.json();
        console.log('Signup response:', signupData);

        // 2. Login
        console.log('\n2. Logging in...');
        const loginResponse = await fetch('http://localhost:8080/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'testseller@example.com',
                password: 'password123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (!loginData.success) {
            console.log('Login failed, exiting...');
            return;
        }

        // Extract cookies from login response
        const cookies = loginResponse.headers.get('set-cookie');
        console.log('Cookies:', cookies);

        // 3. Update profile with required information
        console.log('\n3. Updating profile...');
        const profileResponse = await fetch('http://localhost:8080/api/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            body: JSON.stringify({
                phone: '+1234567890',
                address: {
                    street: '123 Main St',
                    city: 'Test City',
                    state: 'Test State',
                    zipCode: '12345',
                    country: 'USA'
                }
            })
        });

        const profileData = await profileResponse.json();
        console.log('Profile update response:', profileData);

        // 4. Upload verification document
        console.log('\n4. Uploading verification document...');
        const docResponse = await fetch('http://localhost:8080/api/seller/upload-document', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            body: JSON.stringify({
                documentType: 'identity_proof',
                documentUrl: 'https://example.com/test-document.pdf'
            })
        });

        const docData = await docResponse.json();
        console.log('Document upload response:', docData);

        // 5. Apply to become seller
        console.log('\n5. Applying to become seller...');
        const sellerResponse = await fetch('http://localhost:8080/api/seller/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            body: JSON.stringify({
                businessType: 'individual'
            })
        });

        const sellerData = await sellerResponse.json();
        console.log('Seller application response:', sellerData);

        console.log('\nTest completed successfully!');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testSellerApplication();
