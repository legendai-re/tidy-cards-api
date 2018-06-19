module.exports = function getGoogleStrategy (GoogleStrategy) {
  let models = require('../../models')
  let strategiesHelper = require('./strategiesHelper')
  let lifeStates = require('../../models/lifeStates')

  return new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + '/auth/google/callback',
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    models.User.findOne({'google.id': profile.id}).exec(function (err, user) {
      if (err) { return done(err) }
      if (user && req.user) {
        done('google account already used')
      } else if (user && !req.user) {
        if (user.lifeState === lifeStates.ACTIVE.id) { done(null, user) } else { done('account no more active', null) }
      } else if (!user && !req.user) {
        strategiesHelper.createUser(req, profile, accessToken, 'google', function (err, newUser) {
          done(err, newUser)
        })
      } else if (!user && req.user) {
        linkAccountToGoogle()
      }
    })

    let linkAccountToGoogle = function () {
      let user = req.user
      user.google.id = profile.id
      user.google.token = accessToken
      user.save(function (err) {
        if (err) { throw err }
        return done(null, user)
      })
    }
  }
  )
}
