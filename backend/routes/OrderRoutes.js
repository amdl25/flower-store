const express = require('express');
const fetchUser = require('../middleware/authMiddleware');
const { addOrder, getUserOrders, getUserOrderCount } = require('../controllers/OrderController');
const router = express.Router();

router.post('/addorder', addOrder);
router.get('/userorders', fetchUser, getUserOrders);
router.get('/user/:userId/count', getUserOrderCount);

module.exports = router;
