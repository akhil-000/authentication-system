const User = require('../models/user');
const Token = require('../models/token');
const bcrypt = require('bcryptjs');



module.exports.resetPassword =async (req, res) => {
    try {
console.log(req.body.userId)
        const user = await User.findById(req.body.userId);
        console.log(user)
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.body.token
        });
        if (!token) return res.status(400).send("Invalid link or expired");

if(req.body.new_password==req.body.confirm_new_password)
 {       user.password = req.body.new_password;
        await user.save();
        await token.delete();
        return    res.redirect("/users/log-out");
 }

else{
    req.flash('error', "mismatch of  passwords");
    return res.redirect("back");

}


    } catch (error) {
        req.flash('error', "error");
        console.log(error);
        return res.redirect("back");
    }
};

module.exports.changePassword =async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        

if(bcrypt.compareSync(req.body.old_password,user.password) && req.body.new_password==req.body.confirm_new_password)
 {       user.password = req.body.new_password;
        await user.save();
        
    return    res.redirect("/users/log-out");

 }

 else if(!bcrypt.compareSync(req.body.old_password,user.password)){req.flash('error', "mismatch of old passwords");
return res.redirect("back");

 }
else if(req.body.new_password!=req.body.confirm_new_password){
    req.flash('error', "mismatch of new passwords");
    return res.redirect("back");

}

    } catch (error) {
        req.flash('error', "error");
        console.log(error);
        return res.redirect("back");

    }
};