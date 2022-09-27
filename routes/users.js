const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
const recaptchaController = require('../controllers/recaptcha_controller');


router.get('/profile', passport.checkAuthentication, usersController.profile);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create',recaptchaController.recaptcha ,usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session',recaptchaController.recaptcha, passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);
router.get('/log-out', usersController.logoutSession);


router.get('/auth/google', passport.authenticate('google', {scope: [ 'https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile','openid']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}),usersController.createSession);



module.exports = router;