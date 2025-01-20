const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { 
                id: user._id,
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
