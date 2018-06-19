let transporter = require('../transporter')
let fs = require('fs')

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}

require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}

let sendPasswordResetEmail = transporter.templateSender({
  subject: 'Password reset',
  text: require('./template.txt'),
  html: require('./template.html')
}, {
  from: '"TidyCards" <' + process.env.MAILER_USER + '>'
})

function send (user, callback) {
  sendPasswordResetEmail({
    to: user.email
  }, {
    resetUrl: process.env.HOST + '/reset/complete/' + user.local.resetToken
  }, function (err, info) {
    if (err) return callback(err)
    return callback(null, true)
  })
}

module.exports = {
  send: send
}
