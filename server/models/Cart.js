const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [itemSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
