const express = require('express');
const multer = require('multer');
const path = require('path');
const { addMonthlyFlower, getAllMonthlyFlowers, updateMonthlyFlower, removeMonthlyFlower } = require('../controllers/MonthlyFlowerSubscriptionController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

router.post('/addmonthlyflowersubscription', upload.single('flowerImage'), addMonthlyFlower);
router.get('/allmonthlyflowersubscriptions', getAllMonthlyFlowers);
router.put('/updatemonthlyflowersubscription', updateMonthlyFlower);
router.post('/removemonthlyflowersubscription', removeMonthlyFlower);

module.exports = router;
