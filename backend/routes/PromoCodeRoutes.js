const express = require('express');
const router = express.Router();
const { addPromoCode, validatePromoCode, usePromoCode, getAllPromoCodes, removePromoCode, updatePromoCode, getPromoCodesByCriteria } = require('../controllers/PromoCodeController');
const fetchUserOptional = require('../middleware/authMiddleware')

router.post('/addpromocode', addPromoCode);
router.post('/validatepromocode',fetchUserOptional, validatePromoCode);
router.post('/usepromocode',fetchUserOptional, usePromoCode);
router.get('/allpromocodes', getAllPromoCodes);
router.put('/updatepromocode', updatePromoCode);
router.post('/removepromocode', removePromoCode);
router.get('/criteria/:criteria', getPromoCodesByCriteria);



module.exports = router;
