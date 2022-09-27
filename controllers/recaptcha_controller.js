const fetch = require("isomorphic-fetch");
const usersController = require('../controllers/users_controller');


module.exports.recaptcha=   async (req, res,next) => {
    const name = req.body.name;
    // getting site key from client side
    const response_key = req.body["g-recaptcha-response"];
    // Put secret key here, which we get from google console
    const secret_key =process.env.SECRET_KEY;
    
    // Hitting POST request to the URL, Google will
    // respond with success or error scenario.
    const url =
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
    
    // Making POST request to verify captcha
    fetch(url, {
        method: "post",
    })
        .then((response) => response.json())
        .then((google_response) => {
    
        // google_response is the object return by
        // google as a response
        if (google_response.success == true) {
            // if captcha is verified
            res.locals.g_response=true;
           
            return next();


        } else {
            // if captcha is not verified

            res.locals.g_response=false;

            req.flash('error', "captcha required");
            return res.redirect("back");

        }
        })
        .catch((error) => {
            // Some error while verify captcha
            req.flash('error', "error");
            console.log(error);
            return res.redirect("back");
        });
   
    }