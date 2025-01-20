const express = require('express');
const router = express.Router();
const { 
    getSettings, 
    updateSettings, 
    changePassword,
    deleteAccount 
} = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);

module.exports = router; 