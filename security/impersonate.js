module.exports = function impersonate () {
  let models = require('../models')

  return function (req, res, next) {
    if (!req.isAuthenticated() || !req.user.isGranted('ROLE_ADMIN')) return next()
    models.User.findOne({username: req.body.username}).populate('_avatar').exec(function (err, user) {
      if (err) console.log(err)
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
      req.logIn(user, function (err) {
        if (err) { return next(err) }
        res.json({data: req.user})
      })
    })
  }
}
