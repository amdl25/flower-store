
const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, getCartData } = require('../controllers/CartController');
const fetchUserOptional = require('../middleware/authMiddleware');

router.post('/addtocart', fetchUserOptional, addToCart);

router.post('/removefromcart', fetchUserOptional, removeFromCart);
router.post('/getcart', fetchUserOptional, getCartData);

module.exports = router;
