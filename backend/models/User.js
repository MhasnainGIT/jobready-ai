const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        default: 10, // Default credits for a new user
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'starter', 'pro'],
        default: 'free',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema); 