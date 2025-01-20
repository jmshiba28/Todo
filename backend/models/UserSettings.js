const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        dueDateReminder: { type: Boolean, default: true }
    },
    appearance: {
        theme: { 
            type: String, 
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        compactMode: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema); 