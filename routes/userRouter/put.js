module.exports = function put (req, res) {

    let bCrypt      = require('bcrypt-nodejs');
    let models      = require('../../models');
    let usernameValidator = require('../../helpers/user/usernameValidator');
    let updateEmail = require('../../helpers/user/updateEmail');
    let availableLanguages = require('../../languages/availableLanguages.json');

	models.User.findById(req.params.user_id, function(err, user) {
        if (err) {console.log(err); res.sendStatus(500); return;}
        if(!user) {res.status(404).send({ error: 'cannot find user with id: '+req.params.user_id}); return;}
        if(user._id.equals(req.user._id)){
            if(req.body.username)
                updateUsername(user);
            else if(req.body.email)
                preUpdateEmail(user);
            else
                updateProfile(user);
        }else{
        	res.sendStatus(401);
        }
    });

    function updateProfile(user){
        user.name = (req.body.name || user.name);
        user.bio = (req.body.bio || user.bio);
        if(req.body.language && availableLanguages.indexOf(req.body.language) > -1)
            user.language = req.body.language.toLowerCase();
        if(req.body._avatar && req.body._avatar._id){
            models.Image.checkIfOwner(req.body._avatar._id, user, function(err, isOwner){
                if(err) {console.log(err); res.sendStatus(500); return;}
                if(!isOwner) return res.status(422).send({ error: 'cannot update avatar, you are not the owner of this image'});
                user._avatar = req.body._avatar._id;
                saveUser(user);
            })
        }else{
            saveUser(user);
        }
    }

    function updateUsername(user){
        if(!usernameValidator.isValid(req.body.username)){
            return res.status(422).send({ error: 'cannot update username: not valid'});
        }
        models.User.findOne({username: req.body.username.toLowerCase(),  _id: { $ne: user._id }}, function(err, alreadyExistUser){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(alreadyExistUser) return res.status(422).send({ error: 'cannot update username: already takken'});
            user.username = req.body.username;
            saveUser(user);
        })
    }

    function preUpdateEmail(user){
        models.User.findOne({email: req.body.email.toLowerCase().replace(/\s/g, ''),  _id: { $ne: user._id }}, function(err, alreadyExistUser){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(alreadyExistUser) return res.status(422).send({ error: 'cannot update email: already takken'});
            updateEmail.update(user, req.body.email, function(err, user){
                if (err) {console.log(err); res.status(422).send({ error: 'cannot send comfirmation email'}); return;}
                sendResponse(user);
            })
        })
    }

    function saveUser(user){
        user.save(function(err){
            if (err) {console.log(err); res.sendStatus(500); return;}
            sendResponse(user);
        })
    }

    function sendResponse(user){
        res.json({data: user});
    }
}
