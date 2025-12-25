#!/usr/bin/env bash
set -euo pipefail

# CONFIG - adjust if needed
PATCH_FILE="auth-integration.patch"
COMMIT_MSG="chore(server): add Express auth/cart/orders backend under server/"
REMOTE="origin"
TARGET_BRANCH="main"

# 1) Ensure we are in a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository. cd to your repo clone and re-run."
  exit 1
fi

# 2) Make sure working tree is clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: working tree is not clean. Commit or stash changes first."
  git status --porcelain
  exit 1
fi

# 3) Checkout and update target branch
git fetch "$REMOTE"
git checkout "$TARGET_BRANCH"
git pull "$REMOTE" "$TARGET_BRANCH"

# 4) Create the patch file (overwrites if exists)
cat > "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/app.js
+// server/app.js - express app (CommonJS)
+require('dotenv').config();
+const express = require('express');
+const mongoose = require('mongoose');
+
+const app = express();
+
+// Parsing
+app.use(express.json());
+app.use(express.urlencoded({ extended: false }));
+
+// Global rate limiting (basic)
+const rateLimit = require('express-rate-limit');
+app.use(rateLimit({ windowMs: 60 * 1000, max: 300 })); // 300 requests/min per IP
+
+// MongoDB connection
+const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/heavy';
+mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
+  .then(() => console.log('MongoDB connected'))
+  .catch(err => console.error('MongoDB connection error', err));
+
+// Mount routes
+app.use('/api/auth', require('./routes/auth'));
+app.use('/api/cart', require('./routes/cart'));
+app.use('/api/orders', require('./routes/orders'));
+
+// health
+app.get('/health', (req, res) => res.json({ status: 'ok' }));
+
+// basic error handler
+app.use((err, req, res, next) => {
+  console.error(err.stack || err);
+  res.status(500).json({ message: 'Server error' });
+});
+
+module.exports = app;
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/server.js
+// server/server.js - start the app
+require('dotenv').config();
+const app = require('./app');
+
+const PORT = process.env.PORT || 4000;
+
+app.listen(PORT, () => {
+  console.log(`Server listening on port ${PORT}`);
+});
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/config/jwt.js
+module.exports = {
+  jwtSecret: process.env.JWT_SECRET || 'replace_this_secret',
+  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
+  activationExpiresIn: process.env.ACTIVATION_TOKEN_EXPIRES || '24h',
+  resetExpiresInMinutes: Number(process.env.RESET_EXPIRES_MINUTES || 60)
+};
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/config/mail.js
+const nodemailer = require('nodemailer');
+
+const transporter = nodemailer.createTransport({
+  host: process.env.SMTP_HOST,
+  port: Number(process.env.SMTP_PORT || 587),
+  secure: process.env.SMTP_SECURE === 'true',
+  auth: {
+    user: process.env.SMTP_USER,
+    pass: process.env.SMTP_PASS
+  }
+});
+
+module.exports = transporter;
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/models/User.js
+const mongoose = require('mongoose');
+
+const userSchema = new mongoose.Schema({
+  name: { type: String, trim: true },
+  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
+  password: { type: String, required: true },
+  isActive: { type: Boolean, default: false },
+  resetPasswordToken: { type: String },
+  resetPasswordExpires: { type: Date },
+  createdAt: { type: Date, default: Date.now }
+});
+
+module.exports = mongoose.models.User || mongoose.model('User', userSchema);
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/models/Cart.js
+const mongoose = require('mongoose');
+
+const itemSchema = new mongoose.Schema({
+  productId: { type: String, required: true },
+  name: String,
+  price: Number,
+  quantity: { type: Number, default: 1 }
+}, { _id: false });
+
+const cartSchema = new mongoose.Schema({
+  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
+  items: [itemSchema],
+  updatedAt: { type: Date, default: Date.now }
+});
+
+module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/models/Order.js
+const mongoose = require('mongoose');
+
+const orderItemSchema = new mongoose.Schema({
+  productId: String,
+  name: String,
+  price: Number,
+  quantity: Number
+}, { _id: false });
+
+const orderSchema = new mongoose.Schema({
+  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
+  items: [orderItemSchema],
+  totalAmount: { type: Number, required: true },
+  status: { type: String, default: 'created' }, // created, paid, shipped, cancelled
+  payment: {
+    provider: String,
+    transactionId: String,
+    paidAt: Date
+  },
+  createdAt: { type: Date, default: Date.now }
+});
+
+module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/controllers/authController.js
+const bcrypt = require('bcryptjs');
+const jwt = require('jsonwebtoken');
+const crypto = require('crypto');
+const { validationResult } = require('express-validator');
+const User = require('../models/User');
+const transporter = require('../config/mail');
+const { jwtSecret, jwtExpiresIn, activationExpiresIn, resetExpiresInMinutes } = require('../config/jwt');
+
+const createActivationToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: activationExpiresIn });
+const createAuthToken = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
+
+exports.register = async (req, res) => {
+  const errors = validationResult(req);
+  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
+
+  const { name, email, password } = req.body;
+  try {
+    const existing = await User.findOne({ email });
+    if (existing) return res.status(400).json({ message: 'Email already registered' });
+
+    const salt = await bcrypt.genSalt(12);
+    const hashed = await bcrypt.hash(password, salt);
+
+    const user = new User({ name, email, password: hashed, isActive: false });
+    await user.save();
+
+    const token = createActivationToken({ id: user._id, email: user.email });
+    const activationUrl = `${process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:3000'}/activate/${token}`;
+
+    try {
+      await transporter.sendMail({
+        from: process.env.SMTP_FROM || process.env.SMTP_USER,
+        to: user.email,
+        subject: 'Activate your account',
+        text: `Activate your account: ${activationUrl}`,
+        html: `<p>Activate your account: <a href="${activationUrl}">${activationUrl}</a></p>`
+      });
+    } catch (mailErr) {
+      console.error('Mail send error:', mailErr);
+    }
+
+    res.status(201).json({ message: 'Registration successful. Check your email to activate.' });
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.activate = async (req, res) => {
+  const { token } = req.params;
+  try {
+    const payload = jwt.verify(token, jwtSecret);
+    const user = await User.findById(payload.id);
+    if (!user) return res.status(404).json({ message: 'User not found' });
+    if (user.isActive) return res.status(400).json({ message: 'Account already active' });
+
+    user.isActive = true;
+    await user.save();
+    res.json({ message: 'Account activated' });
+  } catch (err) {
+    console.error(err);
+    res.status(400).json({ message: 'Invalid or expired token' });
+  }
+};
+
+exports.login = async (req, res) => {
+  const errors = validationResult(req);
+  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
+
+  const { email, password } = req.body;
+  try {
+    const user = await User.findOne({ email });
+    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
+    if (!user.isActive) return res.status(403).json({ message: 'Account not activated' });
+
+    const match = await bcrypt.compare(password, user.password);
+    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
+
+    const token = createAuthToken({ id: user._id, email: user.email });
+    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.forgotPassword = async (req, res) => {
+  const { email } = req.body;
+  try {
+    const user = await User.findOne({ email });
+    if (!user) return res.status(200).json({ message: 'If that email exists, a reset link was sent' });
+
+    const rawToken = crypto.randomBytes(32).toString('hex');
+    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
+
+    user.resetPasswordToken = hashed;
+    user.resetPasswordExpires = Date.now() + resetExpiresInMinutes * 60 * 1000;
+    await user.save();
+
+    const resetUrl = `${process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:3000'}/reset/${rawToken}`;
+
+    try {
+      await transporter.sendMail({
+        from: process.env.SMTP_FROM || process.env.SMTP_USER,
+        to: user.email,
+        subject: 'Password reset',
+        text: `Reset your password: ${resetUrl}`,
+        html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
+      });
+    } catch (mailErr) {
+      console.error('Mail send error:', mailErr);
+    }
+
+    res.json({ message: 'If that email exists, a reset link was sent' });
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.resetPassword = async (req, res) => {
+  const { token } = req.params;
+  const { password } = req.body;
+  try {
+    const hashed = crypto.createHash('sha256').update(token).digest('hex');
+    const user = await User.findOne({
+      resetPasswordToken: hashed,
+      resetPasswordExpires: { $gt: Date.now() }
+    });
+    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
+
+    const salt = await bcrypt.genSalt(12);
+    user.password = await bcrypt.hash(password, salt);
+    user.resetPasswordToken = undefined;
+    user.resetPasswordExpires = undefined;
+    await user.save();
+
+    res.json({ message: 'Password reset successful' });
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/controllers/cartController.js
+const Cart = require('../models/Cart');
+
+exports.getCart = async (req, res) => {
+  const userId = req.user.id;
+  try {
+    let cart = await Cart.findOne({ userId });
+    if (!cart) {
+      cart = await Cart.create({ userId, items: [] });
+    }
+    res.json(cart);
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.addItem = async (req, res) => {
+  const userId = req.user.id;
+  const { productId, name, price, quantity } = req.body;
+  try {
+    let cart = await Cart.findOne({ userId });
+    if (!cart) cart = await Cart.create({ userId, items: [] });
+
+    const existing = cart.items.find(i => i.productId === productId);
+    if (existing) {
+      existing.quantity += quantity || 1;
+      existing.price = price || existing.price;
+    } else {
+      cart.items.push({ productId, name, price, quantity: quantity || 1 });
+    }
+    cart.updatedAt = Date.now();
+    await cart.save();
+    res.json(cart);
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.updateItem = async (req, res) => {
+  const userId = req.user.id;
+  const { productId } = req.params;
+  const { quantity } = req.body;
+  try {
+    const cart = await Cart.findOne({ userId });
+    if (!cart) return res.status(404).json({ message: 'Cart not found' });
+
+    const item = cart.items.find(i => i.productId === productId);
+    if (!item) return res.status(404).json({ message: 'Item not found' });
+
+    item.quantity = quantity;
+    cart.updatedAt = Date.now();
+    await cart.save();
+    res.json(cart);
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.removeItem = async (req, res) => {
+  const userId = req.user.id;
+  const { productId } = req.params;
+  try {
+    const cart = await Cart.findOne({ userId });
+    if (!cart) return res.status(404).json({ message: 'Cart not found' });
+
+    cart.items = cart.items.filter(i => i.productId !== productId);
+    cart.updatedAt = Date.now();
+    await cart.save();
+    res.json(cart);
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/controllers/orderController.js
+const Order = require('../models/Order');
+const Cart = require('../models/Cart');
+
+exports.createOrder = async (req, res) => {
+  const userId = req.user.id;
+  const { payment } = req.body; // payment info placeholder (provider, transactionId)
+  try {
+    const cart = await Cart.findOne({ userId });
+    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });
+
+    const totalAmount = cart.items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);
+    const order = await Order.create({
+      userId,
+      items: cart.items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
+      totalAmount,
+      status: payment && payment.transactionId ? 'paid' : 'created',
+      payment: payment || {}
+    });
+
+    // clear user's cart
+    cart.items = [];
+    await cart.save();
+
+    res.status(201).json(order);
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.getOrders = async (req, res) => {
+  const userId = req.user.id;
+  try {
+    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
+    res.json(orders);
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
+exports.getOrder = async (req, res) => {
+  const userId = req.user.id;
+  const { id } = req.params;
+  try {
+    const order = await Order.findOne({ _id: id, userId });
+    if (!order) return res.status(404).json({ message: 'Order not found' });
+    res.json(order);
+  } catch (err) {
+    console.error(err);
+    res.status(500).json({ message: 'Server error' });
+  }
+};
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/middleware/auth.js
+const jwt = require('jsonwebtoken');
+const { jwtSecret } = require('../config/jwt');
+
+module.exports = (req, res, next) => {
+  const authHeader = req.headers.authorization || '';
+  const auth = authHeader || (req.cookies && req.cookies.token);
+  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
+
+  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
+  try {
+    const payload = jwt.verify(token, jwtSecret);
+    req.user = { id: payload.id, email: payload.email };
+    next();
+  } catch (err) {
+    return res.status(401).json({ message: 'Invalid or expired token' });
+  }
+};
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/routes/auth.js
+const express = require('express');
+const { body } = require('express-validator');
+const rateLimit = require('express-rate-limit');
+const authController = require('../controllers/authController');
+
+const router = express.Router();
+const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
+
+router.post('/register',
+  limiter,
+  body('email').isEmail().withMessage('Valid email required'),
+  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
+  authController.register
+);
+
+router.get('/activate/:token', authController.activate);
+
+router.post('/login',
+  limiter,
+  body('email').isEmail(),
+  body('password').exists(),
+  authController.login
+);
+
+router.post('/forgot', limiter, body('email').isEmail(), authController.forgotPassword);
+router.post('/reset/:token', limiter, body('password').isLength({ min: 8 }), authController.resetPassword);
+
+module.exports = router;
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/routes/cart.js
+const express = require('express');
+const { body } = require('express-validator');
+const auth = require('../middleware/auth');
+const cartController = require('../controllers/cartController');
+
+const router = express.Router();
+
+router.use(auth);
+
+router.get('/', cartController.getCart);
+
+router.post('/items',
+  body('productId').notEmpty(),
+  body('quantity').optional().isInt({ min: 1 }),
+  cartController.addItem
+);
+
+router.put('/items/:productId',
+  body('quantity').isInt({ min: 1 }),
+  cartController.updateItem
+);
+
+router.delete('/items/:productId', cartController.removeItem);
+
+module.exports = router;
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/routes/orders.js
+const express = require('express');
+const auth = require('../middleware/auth');
+const orderController = require('../controllers/orderController');
+
+const router = express.Router();
+
+router.use(auth);
+
+router.post('/', orderController.createOrder);
+router.get('/', orderController.getOrders);
+router.get('/:id', orderController.getOrder);
+
+module.exports = router;
+
*** End Patch
PATCH

cat >> "$PATCH_FILE" <<'PATCH'
*** Begin Patch
*** Add File: server/.env.example
+# server/.env.example - copy to server/.env or repository root .env
+MONGO_URI=mongodb://localhost:27017/heavy
+JWT_SECRET=replace_with_strong_random_value
+JWT_EXPIRES_IN=1h
+ACTIVATION_TOKEN_EXPIRES=24h
+RESET_EXPIRES_MINUTES=60
+
+SMTP_HOST=smtp.example.com
+SMTP_PORT=587
+SMTP_SECURE=false
+SMTP_USER=you@example.com
+SMTP_PASS=supersecret
+SMTP_FROM="HEAVY <no-reply@example.com>"
+
+FRONTEND_URL=http://localhost:3000
+APP_URL=http://localhost:4000
+
*** End Patch
PATCH

echo "Patch file $PATCH_FILE created."

# 5) Try to apply the patch
if git apply --index --stat "$PATCH_FILE"; then
  echo "Patch can be applied cleanly (stat shown above). Applying now..."
  git apply "$PATCH_FILE"
else
  echo "Patch failed -- aborting. Run 'git apply --check $PATCH_FILE' for details."
  exit 1
fi

# 6) Add files, commit, and push
git add server server/.env.example
git commit -m "$COMMIT_MSG"

# Push directly to main
git push "$REMOTE" "$TARGET_BRANCH"

echo "Patch applied, committed and pushed to $REMOTE/$TARGET_BRANCH."
echo "Next steps:"
echo "  - Install dependencies: npm install express mongoose bcryptjs jsonwebtoken nodemailer express-validator express-rate-limit dotenv"
echo "  - (Optional dev) npm install --save-dev nodemon"
echo "  - Run the server: node server/server.js  OR add scripts in package.json: start:server / dev:server"
