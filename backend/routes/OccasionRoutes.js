const express = require('express');
const { addOccasion, removeOccasion, getAllOccasions, updateOccasion} = require('../controllers/OccasionController');
const router = express.Router();

router.post('/addoccasion', addOccasion);
router.post('/removeoccasion', removeOccasion);
router.get('/alloccasions', getAllOccasions);
router.put('/updateoccasion', updateOccasion);
module.exports = router;