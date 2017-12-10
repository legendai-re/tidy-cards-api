var transporter = require('../transporter');
var fs = require('fs');

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var sendConfirmationEmail = transporter.templateSender({
    subject: 'Email confimation',
    text: require('./template.txt'),
    html: require('./template.html')
}, {
    from: '"TidyCards" <'+process.env.MAILER_USER+'>',
});

function send(user, callback){
    sendConfirmationEmail({
        to: user.email
    }, {
        user_email: user.email,
        confirmUrl: process.env.HOST + '/accounts/confirm_email/'+user.emailConfirmationToken
    }, function(err, info){
        if(err)return callback(err)
        return callback(null, true);
    });
}

module.exports = {
    send: send
}
