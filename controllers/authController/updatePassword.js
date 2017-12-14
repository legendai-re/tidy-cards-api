let logger      = require('../../tools/winston');
let bCrypt      = require('bcrypt-nodejs');
let m           = require('../../models');

module.exports = function updatePassword(params, currentUser, callback) {

    // stop if some parameters are missing
    if(!requiredParamsOk(params))
        return callback(new m.ApiResponse('some required parameters was not provided', 400));

    m.User.findOne({_id: currentUser._id}).select('+local.password').exec(function (err, currentUser) {
        if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}

        // if connection with password is enabled
        if(currentUser.local && currentUser.local.active){

            // stop if the password in params do not match the currentUser password
            if(!passwordsMatch(currentUser.local.password, params.password))
                return callback(new m.ApiResponse('given password do not match with currentUser password', 401));

            // create hash and save the hash
            setPassword(currentUser, params.newPassword, function(err){
                if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
                return callback(new m.ApiResponse(null, 200));
            })
        }
        // if connection with password is no enabled yet
        else{

            // activate local strategy
            currentUser.local.active = true;
            
            // create hash and save the hash
            setPassword(currentUser, params.newPassword, function(err){
                if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
                return callback(new m.ApiResponse(null, 200));
            })
        }
    })

}

/**
 * Return true if all required parameters are defined and corrects
 */
function requiredParamsOk(params){
    return  params.password &&
            params.newPassword &&
            params.newPassword.length > 3;
}

/**
 * Check if oldPasswordHash match the new password
 */
function passwordsMatch(oldPasswordHash, newPassword){
    return bCrypt.compareSync(newPassword, oldPasswordHash);
}

/**
 * Create hash of the new password, update user password and save it to db
 */
function setPassword(currentUser, newPassword, callback){
    currentUser.local.password = createHash(newPassword);
    currentUser.save(function(err){
        callback(err)
    })
}

/**
 * Create hash of the password using the bCrypt library
 */
function createHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}