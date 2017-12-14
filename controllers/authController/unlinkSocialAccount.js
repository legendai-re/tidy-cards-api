let logger          = require('../../tools/winston');
let m               = require('../../models');

module.exports = function unlinkSocialAccount(params, currentUser, callback) {

    if(!params.type)
        return callback(new m.ApiResponse('some required parameters where not provided', 400));

    switch(params.type){
        case 'FACEBOOK':
            if(!currentUser.local.active && !currentUser.twitter.id && !currentUser.google.id)
                return callback(new m.ApiResponse('you must have one way to connect', 400));
            currentUser.facebook.id = null;
            break;
        case 'TWITTER':
            if(!currentUser.local.active && !currentUser.facebook.id && !currentUser.google.id)
                return callback(new m.ApiResponse('you must have one way to connect', 400));
            currentUser.twitter.id = null;
            break;
        case 'GOOGLE':
            if(!currentUser.local.active && !currentUser.twitter.id && !currentUser.facebook.id)
                return callback(new m.ApiResponse('you must have one way to connect', 400));
            currentUser.google.id = null;
            break;
        default:
            return callback(new m.ApiResponse('this social network type di not exist', 400));
    }

    currentUser.save(function(err){
        if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
        return callback(new m.ApiResponse(null, 200, {message: params.type + ' unlinked'}));
    })
    
}
