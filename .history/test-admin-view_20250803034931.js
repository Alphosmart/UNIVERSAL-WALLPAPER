const fetch = require('node-fetch');

async function testAdminView() {
    try {
        console.log('Testing admin view of seller applications...\n');

        // 1. Create admin user
        console.log('1. Creating admin user...');
        const adminResponse = await fetch('http://localhost:8080/api/create-admin');
        const adminData = await adminResponse.json();
        console.log('Admin creation response:', adminData);

        // 2. Login as admin
        console.log('\n2. Logging in as admin...');
        const loginResponse = await fetch('http://localhost:8080/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: adminData.data.email,
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

        // 3. Get pending seller applications
        console.log('\n3. Getting pending seller applications...');
        const pendingResponse = await fetch('http://localhost:8080/api/admin/pending-seller-applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        });

        const pendingData = await pendingResponse.json();
        console.log('Pending applications response:', JSON.stringify(pendingData, null, 2));

        // 4. Get all seller applications
        console.log('\n4. Getting all seller applications...');
        const allResponse = await fetch('http://localhost:8080/api/admin/seller-applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            }
        });

        const allData = await allResponse.json();
        console.log('All applications response:', JSON.stringify(allData, null, 2));

        console.log('\nAdmin test completed successfully!');

    } catch (error) {
        console.error('Admin test failed:', error);
    }
}

testAdminView();
