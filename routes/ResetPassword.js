const express = require('express');
const router = express.Router();
const passport = require('passport');

const resetpasswordController = require('../controllers/reset_password_controller');

router.post('/:userId/:token',  resetpasswordController.resetPassword);
router.post('/change',  resetpasswordController.changePassword);

module.exports = router;