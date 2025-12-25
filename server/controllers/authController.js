const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const transporter = require('../config/mail');
const { jwtSecret, jwtExpiresIn, activationExpiresIn, resetExpiresInMinutes } = require('../config/jwt');

const createActivationToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: activationExpiresIn });
const createAuthToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed, isActive: false });
    await user.save();

    const token = createActivationToken({ id: user._id, email: user.email });
    const activationUrl = `${process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:3000'}/activate/${token}`;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: 'Activate your account',
        text: `Activate your account: ${activationUrl}`,
        html: `<p>Activate your account: <a href="${activationUrl}">${activationUrl}</a></p>`
      });
    } catch (mailErr) {
      console.error('Mail send error:', mailErr);
    }

    res.status(201).json({ message: 'Registration successful. Check your email to activate.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.activate = async (req, res) => {
  const { token } = req.params;
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isActive) return res.status(400).json({ message: 'Account already active' });

    user.isActive = true;
    await user.save();
    res.json({ message: 'Account activated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ message: 'Account not activated' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createAuthToken({ id: user._id, email: user.email });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + resetExpiresInMinutes * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:3000'}/reset/${rawToken}`;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: 'Password reset',
        text: `Reset your password: ${resetUrl}`,
        html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
      });
    } catch (mailErr) {
      console.error('Mail send error:', mailErr);
    }

    res.json({ message: 'If that email exists, a reset link was sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
