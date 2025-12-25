const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, name, price, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const existing = cart.items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += quantity || 1;
      existing.price = price || existing.price;
    } else {
      cart.items.push({ productId, name, price, quantity: quantity || 1 });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.productId === productId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
