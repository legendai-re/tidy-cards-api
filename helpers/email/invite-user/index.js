let transporter = require('../transporter')
let fs = require('fs')

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}

require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8')
}

let sendInviteEmail = transporter.templateSender({
  text: require('./template.txt'),
  html: require('./template.html')
}, {
  from: '"TidyCards" <' + process.env.MAILER_USER + '>'
})

function send (currentUser, inviteEmail, callback) {
  sendInviteEmail({
    to: inviteEmail,
    subject: 'You have been invited on TidyCards by ' + currentUser.name
  }, {
    currentUserName: currentUser.name
  }, function (err, info) {
    if (err) return callback(err)
    return callback(null, true)
  })
}

module.exports = {
  send: send
}
