
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, deleteUserProfile, updateUserProfile } = require('../controllers/UserController');
const fetchUser = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.delete('/profile', fetchUser, deleteUserProfile);
router.put('/profile', fetchUser, updateUserProfile);

module.exports = router;
