module.exports = function putConfirmEmail (req, res) {

    let models      = require('../../models');

    models.User.findById(req.user._id).select('+emailConfirmationToken').exec(function(err, user) {
        if(user.emailConfirmationToken === req.params.confirmation_token){
            user.emailConfirmationToken = '';
            user.emailConfirmed = true;
            user.save(function(err){
                if(err) {console.log(err); res.sendStatus(500); return;}
                res.json({success: true});
            });
        }else{
            res.json({success: false});
        }
    })
}
