const express = require('express');
const { addFlower, removeFlower, flowerColors, getAllFlowers, updateFlower, decreaseFlowerQuantity} = require('../controllers/FlowerController');
const router = express.Router();

router.post('/addflower', addFlower);
router.post('/removeflower', removeFlower);
router.get('/flowerColors/:flowerId', flowerColors);
router.get('/allflowers', getAllFlowers);
router.put('/updateflower', updateFlower);
router.post('/decreasequantity', decreaseFlowerQuantity);
module.exports = router;
