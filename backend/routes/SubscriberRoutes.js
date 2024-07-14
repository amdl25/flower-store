const express = require('express');
const { addSubscriber, getSubscribers } = require('../controllers/SubscriberController');
const router = express.Router();

router.post('/addsubscriber', addSubscriber);
router.get('/subscribers', getSubscribers);

module.exports = router;
