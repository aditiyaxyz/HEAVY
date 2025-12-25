const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { payment } = req.body; // payment info placeholder (provider, transactionId)
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });

    const totalAmount = cart.items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);
    const order = await Order.create({
      userId,
      items: cart.items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount,
      status: payment && payment.transactionId ? 'paid' : 'created',
      payment: payment || {}
    });

    // clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const order = await Order.findOne({ _id: id, userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
