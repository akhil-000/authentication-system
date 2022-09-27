const express = require('express');
const router = express.Router();
const passport = require('passport');

const recaptchaController = require('../controllers/recaptcha_controller');

router.post('/submit',  recaptchaController.recaptcha);

module.exports = router;