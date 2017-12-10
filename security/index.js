module.exports = function(app) {

    var passport        = require('passport');
    var FacebookStrategy = require('passport-facebook').Strategy;
    var TwitterStrategy = require('passport-twitter').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var LocalStrategy   = require('passport-local').Strategy;
    var models          = require('../models');
    var lifeStates      = require('../models/lifeStates');

    app.use(passport.initialize());

    app.use(passport.session());

    passport.use(require('./strategies/local')(LocalStrategy));

    passport.use(require('./strategies/facebook')(FacebookStrategy));

    passport.use(require('./strategies/twitter')(TwitterStrategy));

    passport.use(require('./strategies/google')(GoogleStrategy));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        models.User.findOne({_id: id, lifeState: lifeStates.ACTIVE.id}).populate('_avatar').exec(function(err, user) {
             done(err, user);
        });
    });

};
