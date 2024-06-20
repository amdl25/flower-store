const express = require('express');
const router = express.Router();
const { addPromoCode, validatePromoCode, usePromoCode, getAllPromoCodes, removePromoCode, updatePromoCode } = require('../controllers/PromoCodeController');

router.post('/addpromocode', addPromoCode);
router.post('/validatepromocode', validatePromoCode);
router.post('/usepromocode', usePromoCode);
router.get('/allpromocodes', getAllPromoCodes);
router.put('/updatepromocode', updatePromoCode);
router.delete('/removepromocode/:id', removePromoCode);



module.exports = router;
