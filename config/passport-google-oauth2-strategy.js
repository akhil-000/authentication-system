const passport = require('passport');
const googleStrategy = require( 'passport-google-oauth2' ).Strategy;

const crypto = require('crypto');
const User = require('../models/user');
const keys = JSON.parse(process.env.CREDENTIALS);


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: keys.web.client_id        ,
        clientSecret: keys.web.client_secret,
        callbackURL: keys.web.redirect_uris[0],
        passReqToCallback:true
    },

   
    function(request,accessToken, refreshToken, profile, done){
       
        console.log('ID: '+profile.id);
        console.log('Name: '+profile.displayName);
        console.log('Email : '+profile.emails[0].value);
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log('error in google strategy-passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user){
                // if found, set this user as req.user
                console.log(user);
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}
console.log(user);
                    return done(null, user);
                });
            }

        }); 
    }

));


module.exports = passport;
