module.exports = function getLocalStrategy(LocalStrategy){

    var bCrypt          = require('bcrypt-nodejs');
    var connectionTypes = require('../connectionTypes.json');
    var models          = require('../../models');
    var lifeStates      = require('../../models/lifeStates');

    return new LocalStrategy(

        function (username, password, done) {
            var isValidPassword = function(user, password){
                return bCrypt.compareSync(password, user.local.password);
            }
            var regex = new RegExp(["^", username, "$"].join(""), "i");
            models.User.findOne({ $or: [{username: regex}, {email: regex}], lifeState: lifeStates.ACTIVE.id }).populate('_avatar').select('+local.password').exec(function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {alert: 'Incorrect username.'});
                }
                if (!password || password == '' || !isValidPassword(user, password)) {
                    return done(null, false, {alert: 'Incorrect password.'});
                }
                user.local.password = "";
                return done(null, user);
            });
        }
    )

}
