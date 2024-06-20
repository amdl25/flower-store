const express = require('express');
const fetchUser = require('../middleware/authMiddleware');
const { addOrder, getUserOrders } = require('../controllers/OrderController');
const router = express.Router();

router.post('/addorder', addOrder);
router.get('/userorders', fetchUser, getUserOrders);

module.exports = router;
