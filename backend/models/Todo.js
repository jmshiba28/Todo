const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
        validate: {
            validator: async function(value) {
                if (!value) return true; // Allow null/undefined
                const category = await mongoose.model('Category').findOne({
                    _id: value,
                    userId: this.user
                });
                return !!category;
            },
            message: 'Invalid category'
        }
    },
    repeat: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);
