const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, name, email, phone, instagram, password } = req.body;
        if (!username || !name || !email || !phone || !password) {
            return res.status(400).json({ msg: 'All fields except Instagram are required' });
        }
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ msg: 'User already exists' });
        }
        const user = new User({ username, name, email, phone, instagram, password });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        // For demo purposes, secret should be in env in prod
        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                instagram: user.instagram
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
