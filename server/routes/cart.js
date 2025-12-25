const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.use(auth);

router.get('/', cartController.getCart);

router.post('/items',
  body('productId').notEmpty(),
  body('quantity').optional().isInt({ min: 1 }),
  cartController.addItem
);

router.put('/items/:productId',
  body('quantity').isInt({ min: 1 }),
  cartController.updateItem
);

router.delete('/items/:productId', cartController.removeItem);

module.exports = router;
