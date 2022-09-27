const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');



app.use(express.urlencoded());


app.use(express.static('./assets'));


app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(cookieParser());

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: process.env.CODEIAL_SESSION_COOKIE_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:  MongoStore.create(
        {
            mongoUrl: process.env.ATLAS_URI,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));



app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


app.use(flash());


app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));




app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
