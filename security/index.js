module.exports = function (app) {
  let passport = require('passport')
  let FacebookStrategy = require('passport-facebook').Strategy
  let TwitterStrategy = require('passport-twitter').Strategy
  let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  let LocalStrategy = require('passport-local').Strategy
  let models = require('../models')
  let lifeStates = require('../models/lifeStates')

  app.use(passport.initialize())

  app.use(passport.session())

  passport.use(require('./strategies/local')(LocalStrategy))

  passport.use(require('./strategies/facebook')(FacebookStrategy))

  passport.use(require('./strategies/twitter')(TwitterStrategy))

  passport.use(require('./strategies/google')(GoogleStrategy))

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    models.User.findOne({_id: id, lifeState: lifeStates.ACTIVE.id}).populate('_avatar').exec(function (err, user) {
      done(err, user)
    })
  })
}
