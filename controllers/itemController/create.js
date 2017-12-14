let logger            = require('../../tools/winston');
let itemTypes         = require('../../models/item/itemTypes.json');
let itemDisplayModes  = require('../../models/item/displayModes.json');
let m                 = require('../../models');
let sortTypes         = require('../../models/customSort/sortTypes.json');
let itemContentController = require('./itemContentController');
let defineType        = require('./defineType');

module.exports = function create (user, collectionId, displayMode, description, title, itemType, itemContent, url, callback) {

    let item =  new m.Item();

    if(!collectionId)
        return callback(new m.ApiResponse('you must define a collectionId', 400));

    // if a specific displayMode is defined and is OK, update the item
    if(displayMode && displayModeOk(displayMode))
        item.displayMode = displayMode;

    // if description is defined, update the item
    if(description)
        item.description = description;

    // if title is defined, update the item
    if(title)
        item.title = title;

    // check if the collection passed as parameter belong to the currentUser
    m.Collection.findById(collectionId, function(err, collection){
        if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}

        if(!collection)
            return callback(new m.ApiResponse("cannot find collection with id: "+collectionId, 400));

        if(collection._author.toString() !== user._id.toString())
            return callback(new m.ApiResponse("only the author of the collection can add item", 401));

        // if the itemContent have already been created
        if(itemContent && typeOk(itemType)){

            // set the type and the content of the item
            item.type = itemType;
            item._content = itemContent;
            manageItemWithContent(collection);

        // if itemContent need to be created
        }else if(url) {
            manageItemWithNoContentYet(collection);

        // if there is only a description -> itemType = TEXT
        } else if(description){
            manageItemText(collection);

        }else{
            return callback(new m.ApiResponse('missing parameters', 400));
        }

    });

    function typeOk(reqType){
        return itemTypes[reqType] !== null;
    }

    function displayModeOk(reqDisplayMode){
        return itemDisplayModes[reqDisplayMode] !== null;
    }

    function manageItemWithContent(collection){
        itemContentController.checkItemContent(user, itemType, itemContent, function(err, content){
            if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
            if(!content && !item.description)
                return callback(new m.ApiResponse("you must add a description if there is no url", 400));
            if(content){
                item.host = getHostFromItemContent(content);
                item._content = content._id;
            }
            collection.addItem(item, function(err, item){
                if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
                addToCollectionItemsCustomSort(collection, item);
            });
        });
    }

    function manageItemWithNoContentYet(collection){
        let itemType = defineType(url).itemType;

        itemContentController.create(user, itemType, url, function (apiResponse) {
            if(apiResponse.err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}

            let itemContent = apiResponse.data.itemContent;

            if(!itemContent && !item.description)
                return callback(new m.ApiResponse("you must add a description if there is no url", 400));

            if(itemContent){
                if(!item.title)
                    item.title = getTitleFromContent(itemType, itemContent);
                item.host = getHostFromItemContent(itemContent);
                item._content = itemContent._id;
                item.type = itemType;
            }else{
                item.type = itemTypes.TEXT.id;
            }

            collection.addItem(item, function(err, item){
                if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
                item._content = itemContent;
                addToCollectionItemsCustomSort(collection, item);
            });
        });

    }

    function manageItemText(collection){
        item.type = itemTypes.TEXT.id;
        collection.addItem(item, function(err, item){
            if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
            addToCollectionItemsCustomSort(collection, item);
        });
    }

    function addToCollectionItemsCustomSort(collection, item){
        m.CustomSort.findOneAndUpdate(
            {type: sortTypes.COLLECTION_ITEMS.id, _collection: collection._id},
            { $push: {
                ids: {
                    $each: [ item._id ],
                    $position: 0
                }
            }},
            function(err, customSort){
                if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500));}
                sendResponse(item);
            }
        )
    }

    function getHostFromItemContent(content){
        switch(item.type){
            case itemTypes.URL.id:
                return getHostFromUrl(content.url);
            case itemTypes.IMAGE.id:
                return getHostFromUrl(content.url);
            case itemTypes.YOUTUBE.id:
                return 'www.youtube.com';
            case itemTypes.TWEET.id:
                return 'twitter.com';
            case itemTypes.COLLECTION.id:
                return 'collection';
            default:
                return 'none';
        }
    }

    function getTitleFromContent(type, content){
        switch(type){
            case itemTypes.URL.id:
                return content.title;
            case itemTypes.IMAGE.id:
                return 'image';
            case itemTypes.YOUTUBE.id:
                return content.snippet.title;
            case itemTypes.TWEET.id:
                return 'tweet';
            case itemTypes.COLLECTION.id:
                return content.title;
            default:
                return '';
        }
    }

    function getHostFromUrl(url){
        let noHttpUrl = removeHttp(url);
        if(noHttpUrl)
            return noHttpUrl.split('/')[0];
        else
            return 'null';
    }

    function removeHttp(url){
        if(url.substring(0, 7) === 'http://'){
            url = url.substr(7);
        }else if(url.substring(0, 8) === 'https://'){
            url = url.substr(8);
        }
        return url;
    }

    function sendResponse(item){
        return callback(new m.ApiResponse(null, 200, item));
    }
};
