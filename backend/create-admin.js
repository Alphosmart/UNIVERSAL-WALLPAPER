// Quick admin user creation and login test
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const userModel = require('./models/userModel');

async function createAdminUser() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/MERN-ecommerce');
        console.log('Connected to MongoDB');
        
        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ email: 'admin@test.com' });
        if (existingAdmin) {
            console.log('Admin user already exists:');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            console.log('Name:', existingAdmin.name);
            await mongoose.disconnect();
            return;
        }
        
        // Create new admin user
        const salt = bcryptjs.genSaltSync(10);
        const hashPassword = bcryptjs.hashSync('admin123', salt);
        
        const newAdmin = new userModel({
            name: 'Test Admin',
            email: 'admin@test.com',
            password: hashPassword,
            role: 'ADMIN'
        });
        
        await newAdmin.save();
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@test.com');
        console.log('Password: admin123');
        console.log('Role: ADMIN');
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        await mongoose.disconnect();
    }
}

createAdminUser();
