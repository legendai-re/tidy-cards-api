module.exports = function getLocalStrategy(FacebookStrategy){

    let models          = require('../../models');
    let strategiesHelper = require('./strategiesHelper');
    let lifeStates      = require('../../models/lifeStates');

    return new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.HOST + "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'picture.type(large)','emails'],
        passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done) {
        models.User.findOne({'facebook.id': profile.id}).exec(function(err, user) {
            if (err) { return done(err); }
            if(user && req.user){
                done('facebook account already used');
            }else if(user && !req.user){
                if(user.lifeState === lifeStates.ACTIVE.id)
                    done(null, user);
                else
                    done("account no more active", null);
            }else if(!user && !req.user){
                strategiesHelper.createUser(req, profile, accessToken, 'facebook', function(err, newUser){
                    done(err, newUser);
                });
            }else if(!user && req.user){
                linkAccountToFacebook();
            }
        });

        let linkAccountToFacebook = function(){
            let user            = req.user;
            user.facebook.id    = profile.id;
            user.facebook.token = accessToken;
            user.save(function(err) {
                if (err)
                    throw err;
                return done(null, user);
            });
        }
    }
    )

}
