const UserSettings = require('../models/UserSettings');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getSettings = async (req, res) => {
    try {
        let settings = await UserSettings.findOne({ userId: req.user.id });
        if (!settings) {
            settings = await UserSettings.create({ userId: req.user.id });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { notifications, appearance } = req.body;
        let settings = await UserSettings.findOne({ userId: req.user.id });
        
        if (!settings) {
            settings = new UserSettings({ userId: req.user.id });
        }

        if (notifications) {
            settings.notifications = { ...settings.notifications, ...notifications };
        }
        if (appearance) {
            settings.appearance = { ...settings.appearance, ...appearance };
        }

        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        await UserSettings.findOneAndDelete({ userId: req.user.id });
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 