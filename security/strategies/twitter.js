module.exports = function getTwitterStrategy(TwitterStrategy){

    var models          = require('../../models');
    var strategiesHelper = require('./strategiesHelper');
    var lifeStates      = require('../../models/lifeStates');

    return new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
        callbackURL: process.env.HOST + "/auth/twitter/callback",
        passReqToCallback : true
    },
    function(req, accessToken, tokenSecret, profile, done) {
        models.User.findOne({'twitter.id': profile.id}).exec(function(err, user) {
            if (err) { return done(err); }
            if(user && req.user){
                done('Twitter account already used');
            }else if(user && !req.user){
                if(user.lifeState === lifeStates.ACTIVE.id)
                    done(null, user);
                else
                    done("account no more active", null);
            }else if(!user && !req.user){
                strategiesHelper.createUser(req, profile, accessToken, 'twitter', function(err, newUser){
                    done(err, newUser);
                });
            }else if(!user && req.user){
                linkAccountToTwitter();
            }
        });

        var linkAccountToTwitter = function(){
            var user           = req.user;
            user.twitter.id    = profile.id;
            user.twitter.token = accessToken;
            user.save(function(err) {
                if (err)
                    throw err;
                return done(null, user);
            });
        }
    }
    )

}
