const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const requireAdmin = async (req, res) => {
    const admin = await userModel.findById(req.userId).select('role');
    if (!admin || admin.role !== 'ADMIN') {
        res.status(403).json({ success: false, error: true, message: 'Admin privileges required' });
        return false;
    }
    return true;
};

const getManagedUser = async (req, res) => {
    try {
        if (!(await requireAdmin(req, res))) return;
        const user = await userModel.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ success: false, error: true, message: 'User not found' });
        res.json({ success: true, error: false, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: true, message: error.message });
    }
};

const updateManagedUser = async (req, res) => {
    try {
        if (!(await requireAdmin(req, res))) return;
        const { name, phone, address } = req.body;
        const update = {};
        if (typeof name === 'string') update.name = name.trim();
        if (typeof phone === 'string') update.phone = phone.trim();
        if (address && typeof address === 'object') {
            update.address = {
                street: address.street || '', city: address.city || '', state: address.state || '',
                zipCode: address.zipCode || '', country: address.country || ''
            };
        }
        const user = await userModel.findByIdAndUpdate(req.params.userId, update, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, error: true, message: 'User not found' });
        res.json({ success: true, error: false, message: 'User updated successfully', data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: true, message: error.message });
    }
};

const resetManagedUserPassword = async (req, res) => {
    try {
        if (!(await requireAdmin(req, res))) return;
        const { temporaryPassword } = req.body;
        if (typeof temporaryPassword !== 'string' || temporaryPassword.length < 8) {
            return res.status(400).json({ success: false, error: true, message: 'Temporary password must be at least 8 characters' });
        }
        const password = await bcrypt.hash(temporaryPassword, 12);
        const user = await userModel.findByIdAndUpdate(req.params.userId, {
            password, mustChangePassword: true, temporaryPasswordSetAt: new Date()
        }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, error: true, message: 'User not found' });
        res.json({ success: true, error: false, message: 'Temporary password set. The user must change it at next login.', data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: true, message: error.message });
    }
};

const changeRequiredPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (typeof newPassword !== 'string' || newPassword.length < 8) {
            return res.status(400).json({ success: false, error: true, message: 'New password must be at least 8 characters' });
        }
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, error: true, message: 'User not found' });
        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ success: false, error: true, message: 'Choose a password different from the temporary password' });
        }
        user.password = await bcrypt.hash(newPassword, 12);
        user.mustChangePassword = false;
        user.temporaryPasswordSetAt = undefined;
        await user.save();
        res.json({ success: true, error: false, message: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: true, message: error.message });
    }
};

module.exports = { getManagedUser, updateManagedUser, resetManagedUserPassword, changeRequiredPassword };
