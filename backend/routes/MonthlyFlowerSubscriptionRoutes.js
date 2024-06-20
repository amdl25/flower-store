const express = require('express');
const { addMonthlyFlower, getAllMonthlyFlowers, updateMonthlyFlower, removeMonthlyFlower } = require('../controllers/MonthlyFlowerSubscriptionController');
const router = express.Router();

router.post('/addmonthlyflowersubscription', addMonthlyFlower);
router.get('/allmonthlyflowersubscriptions', getAllMonthlyFlowers);
router.put('/updatemonthlyflowersubscription', updateMonthlyFlower);
router.post('/removemonthlyflowersubscription', removeMonthlyFlower);

module.exports = router;
