const fetch = require('node-fetch');

async function testAdminEndpoints() {
    try {
        console.log('Testing admin seller applications endpoints...\n');

        // 1. Create a new admin for testing
        console.log('1. Creating new admin...');
        const adminSignupResponse = await fetch('http://localhost:8080/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Admin Test',
                email: 'admin.test@example.com',
                password: 'admin123'
            })
        });

        const adminSignupData = await adminSignupResponse.json();
        console.log('Admin signup response:', adminSignupData);

        if (!adminSignupData.success) {
            console.log('Admin signup failed, trying to login with existing admin...');
        }

        // 2. Update the user to be an admin via direct database update
        console.log('\n2. Need to manually update user role to ADMIN...');
        console.log('User ID to update:', adminSignupData.data?._id);
        
        // 3. Login as admin
        console.log('\n3. Logging in as admin...');
        const loginResponse = await fetch('http://localhost:8080/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin.test@example.com',
                password: 'admin123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Admin login response:', loginData);

        if (!loginData.success) {
            console.log('Admin login failed, exiting...');
            return;
        }

        // Extract cookies from login response
        const cookies = loginResponse.headers.get('set-cookie');

        // 4. Get pending seller applications
        console.log('\n4. Getting pending seller applications...');
        const pendingResponse = await fetch('http://localhost:8080/api/admin/pending-seller-applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        });

        const pendingData = await pendingResponse.json();
        console.log('Pending applications response:');
        console.log(JSON.stringify(pendingData, null, 2));

        // 5. Get all seller applications
        console.log('\n5. Getting all seller applications...');
        const allResponse = await fetch('http://localhost:8080/api/admin/seller-applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        });

        const allData = await allResponse.json();
        console.log('All applications response:');
        console.log(JSON.stringify(allData, null, 2));

        console.log('\nAdmin test completed!');

    } catch (error) {
        console.error('Admin test failed:', error);
    }
}

testAdminEndpoints();
