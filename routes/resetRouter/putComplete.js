module.exports = function putComplete(req, res) {

    var bCrypt      = require('bcrypt-nodejs');
    var models      = require('../../models');

    if(!req.body.reset_token || !req.body.password || req.body.password.length < 3){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        models.User.findOne({"local.resetToken": req.body.reset_token}).select('+local.resetToken +local.password').exec(function (err, user) {
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(!user) return sendResponse("this token do not match to any account", false);
            if(!isAbleToCompleteReset(user))
                return sendResponse("this reset token is no longer valid", false);

            user.local.resetToken = "";
            user.local.resetRequestDate = null;
            user.local.password = createHash(req.body.password);
            saveUserAndLogin(user);

        })
    }

    function isAbleToCompleteReset(user){
        if(user.local.resetRequestDate){
            var timeDiff = Math.abs(new Date() - user.local.resetRequestDate.getTime());
            var diffHours = Math.ceil(timeDiff / (1000 * 3600));
            if(diffHours>24)
                return false;
        }
        return true;
    }

    function createHash(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    function saveUserAndLogin(user){
        user.save(function(err){
            if(err) {console.log(err); res.sendStatus(500); return;}
            req.login(user, function(err) {
                if (err) {res.sendStatus(500); return;}
                req.user.local.password = "";
                sendResponse(null, true);
            });
        });
    }

    function sendResponse(err, success){
        res.json({success: success, error: err});
    }
}
