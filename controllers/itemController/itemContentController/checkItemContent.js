let itemTypes       = require('../../../models/item/itemTypes.json');
let models          = require('../../../models');

module.exports = function checkItemContent(user, itemType, itemContent, callback){

    switch(itemType){
        case itemTypes.URL.id:
            return checkItemByType(user, itemType, itemContent, callback);
        case itemTypes.IMAGE.id:
            return checkItemByType(user, itemType, itemContent, callback);
        case itemTypes.YOUTUBE.id:
            return checkItemByType(user, itemType, itemContent, callback);
        case itemTypes.TWEET.id:
            return checkItemByType(user, itemType, itemContent, callback);
        case itemTypes.COLLECTION.id:
            return checkItemByType(user, itemType, itemContent, callback);
        case itemTypes.TEXT.id:
            return callback(null, null);
        default:
            return callback("unknown type", null);
    }
};

function manageItemContentResult(err, user, itemContent, callback){
    if(err) return callback(err);
    if(!itemContent) return callback("itemContent : cannot find itemContent");
    if(itemContent._user.toString() !== user._id.toString())
        return callback("itemContent : this item do not belong to the current account");
    return callback(null, itemContent)
}

function checkItemByType(user, itemType, itemContent, callback){
    if(!itemContent)
        return callback(null, null);

    switch(itemType){
        case itemTypes.URL.id:
            models.ItemUrl.findById(itemContent._id, function(err, itemContent){
                manageItemContentResult(err, user, itemContent, callback);
            });
            break;
        case itemTypes.IMAGE.id:
            models.ItemImage.findById(itemContent._id, function(err, itemContent){
                manageItemContentResult(err, user, itemContent, callback);
            });
            break;
        case itemTypes.YOUTUBE.id:
            models.ItemYoutube.findById(itemContent._id, function(err, itemContent){
                manageItemContentResult(err, user, itemContent, callback);
            });
            break;
        case itemTypes.TWEET.id:
            models.ItemTweet.findById(itemContent._id, function(err, itemContent){
                manageItemContentResult(err, user, itemContent, callback);
            });
            break;
        case itemTypes.COLLECTION.id:
            models.Collection.findById(itemContent._id, function(err, collection){
                manageItemContentResult(err, user, collection, callback);
            });
    }
}