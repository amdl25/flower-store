const express = require('express');
const { addProduct, removeProduct, updateProduct, getAllProducts, newCollection, productsDiscounted, getProductById } = require('../controllers/ProductController');
const router = express.Router();

router.post('/addproduct', addProduct);
router.post('/removeproduct', removeProduct);
router.put('/updateproduct', updateProduct);
router.get('/allproducts', getAllProducts);
router.get('/newcollection', newCollection);
router.get('/discounted', productsDiscounted);
router.get('/:id', getProductById);
module.exports = router;
