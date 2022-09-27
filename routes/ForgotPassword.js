const express = require('express');
const router = express.Router();

const forgotpasswordController = require('../controllers/forgot_password_controller');

router.get('/sendlink', (req,res)=>{return res.render('forgot_password.ejs',{title:"forgot password"})});
router.post('/recover', forgotpasswordController.recover,forgotpasswordController.mailsender);
router.get('/passwordreset/:userId/:token', forgotpasswordController.reset);
module.exports = router;