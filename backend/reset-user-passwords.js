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
    // ... other fields
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

async function resetUserPasswords() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Hash the new password
        const newPassword = 'password123';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update all users with the new password
        const result = await User.updateMany(
            {}, // Update all users
            { password: hashedPassword }
        );

        console.log(`✅ Updated ${result.modifiedCount} users with new password: ${newPassword}`);
        
        // List all users after update
        const users = await User.find({}, 'name email role').sort({ role: 1, name: 1 });
        console.log('\n📋 Updated users:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
        });

        console.log(`\n🔐 All users can now login with password: ${newPassword}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from MongoDB');
    }
}

resetUserPasswords();
