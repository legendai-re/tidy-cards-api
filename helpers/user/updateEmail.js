let models = require('../../models')
let emailConfirmation = require('../email/email-confirmation')

function update (user, email, callback) {
  generateToken(function (err, token) {
    if (err) return callback(err, user)
    updateUserEmailAndToken(user, email, token, function (err, user) {
      if (err) return callback(err, user)
      emailConfirmation.send(user, function (err, success) {
        if (err) return callback(err, user)
        user.emailConfirmationToken = ''
        return callback(null, user)
      })
    })
  })
}

function generateToken (callback) {
  require('crypto').randomBytes(48, function (err, buffer) {
    callback(err, buffer.toString('hex'))
  })
}

function updateUserEmailAndToken (user, email, token, callback) {
  user.email = email.toLowerCase()
  user.emailConfirmed = false
  user.emailConfirmationToken = token
  user.save(function (err) {
    callback(err, user)
  })
}

module.exports = {
  update: update
}
