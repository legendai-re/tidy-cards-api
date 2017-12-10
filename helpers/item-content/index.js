var itemTypes       = require('../../models/item/itemTypes.json');
var models          = require('../../models');

function checkItemContent(item, req, callback){
    switch(item.type){
        case itemTypes.URL.id:
            return checkItemByType(item.type, req, callback);
        case itemTypes.IMAGE.id:
            return checkItemByType(item.type,req, callback);
        case itemTypes.YOUTUBE.id:
            return checkItemByType(item.type, req, callback);
        case itemTypes.TWEET.id:
            return checkItemByType(item.type, req, callback);
        case itemTypes.COLLECTION.id:
            return checkItemByType(item.type, req, callback);
        case itemTypes.TEXT.id:
            return callback(null, null);
        default:
            return callback("unknow type", null);
    }
}

function checkItemByType(type, req, callback){
    if(!req.body._content || !req.body._content._id){
        callback("some required parameters was not provided", null);
        return;
    }
    switch(type){
        case itemTypes.URL.id:
            models.ItemUrl.findById(req.body._content._id, function(err, itemContent){
                if(err) return callback(err);
                if(!itemContent) return callback("itemContent : cannot find itemContent");
                if(itemContent._user != req.user._id) return callback("itemContent : this item do not belong to the current account");
                return callback(null, itemContent)
            });
            break;
        case itemTypes.IMAGE.id:
            models.ItemImage.findById(req.body._content._id, function(err, itemContent){
                if(err) return callback(err);
                if(!itemContent) return callback("itemContent : cannot find itemContent");
                if(itemContent._user != req.user._id) return callback("itemContent : this item do not belong to the current account");
                return callback(null, itemContent)
            });
            break;
        case itemTypes.YOUTUBE.id:
            models.ItemYoutube.findById(req.body._content._id, function(err, itemContent){
                if(err) return callback(err);
                if(!itemContent) return callback("itemContent : cannot find itemContent");
                if(itemContent._user != req.user._id) return callback("itemContent : this item do not belong to the current account");
                return callback(null, itemContent)
            });
            break;
        case itemTypes.TWEET.id:
            models.ItemTweet.findById(req.body._content._id, function(err, itemContent){
                if(err) return callback(err);
                if(!itemContent) return callback("itemContent : cannot find itemContent");
                if(itemContent._user != req.user._id) return callback("itemContent : this item do not belong to the current account");
                return callback(null, itemContent)
            });
            break;
        case itemTypes.COLLECTION.id:
            models.Collection.findById(req.body._content._id, function(err, collection){
                if(err) return callback(err);
                if(!collection) return callback("itemContent : cannot find itemContent");
                if(collection._author != req.user._id) return callback("itemContent : this collection do not belong to the current account");
                collection.lifeState = 'ACTIVE';
                collection.save(function(err){
                    if(err) return callback(err);
                    return callback(null, collection)
                });
            });
    }
}


module.exports = {
    checkItemContent: checkItemContent,
    createItemImage: require('./createItemImage'),
    createItemTweet: require('./createItemTweet'),
    createItemYoutube: require('./createItemYoutube'),
    createItemUrl: require('./createItemUrl'),
}
