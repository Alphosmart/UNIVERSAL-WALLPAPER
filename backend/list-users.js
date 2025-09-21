const mongoose = require('mongoose');
const User = require('./models/userModel');

async function listUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/MERN-ecommerce');
        console.log('Connected to MongoDB');
        
        const users = await User.find({}, 'email name role').limit(10);
        console.log('\n📋 Existing Users:');
        console.log('================');
        
        if (users.length === 0) {
            console.log('❌ No users found in database');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}`);
                console.log(`   Name: ${user.name}`);
                console.log(`   Role: ${user.role}`);
                console.log('   ---');
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listUsers();
