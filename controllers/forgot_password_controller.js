const User = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');
const path = require('path');
const process = require('process');
const {google} = require('googleapis');

const MailComposer = require('nodemailer/lib/mail-composer');
var userid;
var tokenvalue;
var recipient;
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

//const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
//const tokens =path.join(process.cwd(), 'token.json');

const tokenfile=JSON.parse(process.env.TOKENS);

const keys = JSON.parse(process.env.CREDENTIALS);

console.log(keys.web)

const oauth2Client = new google.auth.OAuth2(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
);


module.exports.reset =async  (req, res) => {
try{

    let token=await Token.findOne({token: req.params.token, userId: req.params.userId})
   let user=await User.findById(token.userId)


   if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

            //Redirect user to form with the email address
       return     res.render('reset_password', {title:"reset password",
                userId:req.params.userId,
                token:req.params.token,
                user:user
            });
}

        catch(error){res.status(500).json({message: error.message});
       }
};




    
  
  module.exports.recover =async (req, res , next) => {
    try {
       
        const user = await User.findOne({ email: req.body.email });
        if (!user)
      {  req.flash('error', "user with given email doesn't exist");
return res.redirect("back");}

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save();
        }

      

//req.user=user._id;
//req.token=token.token;
//req.recipient=req.body.email;

userid=user._id;
tokenvalue=token.token;
recipient=req.body.email;




next();
        //  authorize().catch(console.error);
       
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
};


// [END gmail_quickstart]

const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

  module.exports.mailsender=  async (req,res) => {
    const link = `https://authentic-system.herokuapp.com/ForgotPassword/passwordreset/${userid}/${tokenvalue}`;

    try{
      const options = {
        from: 'akhilampajala@gmail.com',
        to: recipient,
        subject: "password reset request!",
       text: `Hi \n 
       Please click on the following link ${link}  to reset your password. \n\n 
       If you did not request this, please ignore this email and your password will remain unchanged.\n`
     }
    

     oauth2Client.credentials=tokenfile;
     console.log( oauth2Client.credentials)

     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    },
  });
  console.log (id);
      req.flash('success', "password reset link sent");
      return  res.redirect('back')

    }
    catch (error) {
      res.send("An error occured");
      console.log(error);
  }


  }

