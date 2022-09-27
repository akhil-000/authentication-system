const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users_controller');

console.log('router loaded');


router.get('/', usersController.signIn);
router.use('/users', require('./users'));
router.use('/ForgotPassword', require('./ForgotPassword'));
router.use('/ResetPassword', require('./ResetPassword'));
router.use('/recaptcha', require('./recaptcha'));



module.exports = router;