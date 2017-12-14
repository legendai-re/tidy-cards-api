module.exports = function putInitiate(req, res) {

    let bCrypt      = require('bcrypt-nodejs');
    let models      = require('../../models');
    let passwordResetEmail = require('../../helpers/email/password-reset');

    if(!req.body.user_id){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        models.User.findOne({_id: req.body.user_id}).select('+local.resetToken').exec(function (err, user) {
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(!user) return res.status(404).send({ error: 'cannot find user with id : '+ req.body.user_id});
            if(!isAbleToinitiateReset(user))
                return sendResponse("request done less than 24 hours ago or no local strategy or emailnot confirmed", false);
            generateToken(function(err, token){
                user.local.resetToken = token;
                user.local.resetRequestDate = new Date();
                saveUserAndSendEmail(user);
            })
        })
    }

    function isAbleToinitiateReset(user){
        if(!user.local.active || !user.emailConfirmed)
            return false;
        if(user.local.resetRequestDate){
            let timeDiff = Math.abs(new Date() - user.local.resetRequestDate.getTime());
            let diffHours = Math.ceil(timeDiff / (1000 * 3600));
            if(diffHours<24)
                return false;
        }
        return true;
    }

    function generateToken(callback){
        require('crypto').randomBytes(48, function(err, buffer) {
            callback(err, buffer.toString('hex'));
        })
    }

    function saveUserAndSendEmail(user){
        user.save(function(err){
            if(err) {console.log(err); res.sendStatus(500); return;}
            passwordResetEmail.send(user, function(err, success){
                if(err) {console.log(err); res.sendStatus(500); return;}
                sendResponse(null, true);
            })
        });
    }

    function sendResponse(err, success){
        res.json({success: success, error: err});
    }
}
