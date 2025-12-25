const express = require('express');
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(auth);

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;
