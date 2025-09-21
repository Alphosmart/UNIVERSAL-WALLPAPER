const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    profilePic: String,
    role: { type: String, default: "GENERAL" },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

async function addAdminUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'alpho4luv@gmail.com' });
        if (existingUser) {
            console.log('⚠️ User already exists, updating password and role...');
            
            // Hash the new password
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            // Update existing user
            await User.updateOne(
                { email: 'alpho4luv@gmail.com' },
                { 
                    password: hashedPassword,
                    role: 'ADMIN',
                    name: 'Admin User'
                }
            );
            console.log('✅ Updated existing user with admin role');
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            // Create new admin user
            const newAdmin = new User({
                name: 'Admin User',
                email: 'alpho4luv@gmail.com',
                password: hashedPassword,
                role: 'ADMIN',
                profilePic: ''
            });

            await newAdmin.save();
            console.log('✅ Created new admin user');
        }

        // List all users to confirm
        const users = await User.find({}, 'name email role').sort({ role: 1, name: 1 });
        console.log('\n📋 All users:');
        users.forEach((user, index) => {
            const roleIcon = user.role === 'ADMIN' ? '👑' : user.role === 'SHIPPING_COMPANY' ? '🚚' : '👤';
            console.log(`${index + 1}. ${roleIcon} ${user.name} (${user.email}) - Role: ${user.role}`);
        });

        console.log(`\n🔐 Admin login credentials:`);
        console.log(`   Email: alpho4luv@gmail.com`);
        console.log(`   Password: admin123`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from MongoDB');
    }
}

addAdminUser();
