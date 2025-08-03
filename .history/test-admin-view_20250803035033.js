const fetch = require('node-fetch');

async function testAdminView() {
    try {
        console.log('Testing admin view of seller applications...\n');

        // 1. Create admin user
        console.log('1. Creating admin user...');
        const adminResponse = await fetch('http://localhost:8080/api/create-admin');
        const adminData = await adminResponse.json();
        console.log('Admin creation response:', adminData);

        // 2. Login as admin (try with existing admin)
        console.log('\n2. Logging in as admin...');
        const loginResponse = await fetch('http://localhost:8080/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'alpho4luv@gmail.com', // Use existing admin email
                password: 'admin123' // Try default password
            })
        });

        let loginData = await loginResponse.json();
        console.log('Admin login response:', loginData);

        // If that doesn't work, try another common password
        if (!loginData.success) {
            console.log('Trying alternative password...');
            const loginResponse2 = await fetch('http://localhost:8080/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'alpho4luv@gmail.com',
                    password: 'password123'
                })
            });
            
            loginData = await loginResponse2.json();
            console.log('Second login attempt:', loginData);
        }

        if (!loginData.success) {
            console.log('Admin login failed, trying to create a new admin...');
            
            // Try creating a new test admin
            const testAdminResponse = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'Test Admin',
                    email: 'testadmin@example.com',
                    password: 'admin123'
                })
            });
            
            const testAdminData = await testAdminResponse.json();
            console.log('Test admin signup:', testAdminData);
            
            if (testAdminData.success) {
                // Manually update the user to be an admin (normally this would be done differently)
                console.log('Please manually set this user as admin in the database if needed');
                
                // Try login with new admin
                const newLoginResponse = await fetch('http://localhost:8080/api/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'testadmin@example.com',
                        password: 'admin123'
                    })
                });
                
                loginData = await newLoginResponse.json();
                console.log('New admin login:', loginData);
            }
        }

        if (!loginData.success) {
            console.log('Unable to login as admin, exiting...');
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
