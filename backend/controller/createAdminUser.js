const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

// Create admin user - for development purposes only
async function createAdminUser(req, res) {
    try {
        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ role: 'ADMIN' });
        
        if (existingAdmin) {
            return res.json({
                message: "Admin user already exists",
                data: {
                    name: existingAdmin.name,
                    email: existingAdmin.email,
                    role: existingAdmin.role
                },
                success: true,
                error: false
            });
        }

        // Create default admin user
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync("admin123", salt);

        const adminUser = new userModel({
            name: "Admin User",
            email: "admin@example.com",
            password: hashPassword,
            role: "ADMIN",
            phone: "+1234567890",
            address: {
                street: "123 Admin Street",
                city: "Admin City",
                state: "Admin State",
                zipCode: "12345",
                country: "Admin Country"
            }
        });

        const savedAdmin = await adminUser.save();

        res.status(201).json({
            data: {
                name: savedAdmin.name,
                email: savedAdmin.email,
                role: savedAdmin.role,
                _id: savedAdmin._id
            },
            success: true,
            error: false,
            message: "Admin user created successfully! Email: admin@example.com, Password: admin123"
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = createAdminUser;
