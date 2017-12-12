module.exports = function post (req, res) {

    var itemTypes       = require('../../models/item/itemTypes.json');
    var itemDisplayModes = require('../../models/item/displayModes.json');
    var models          = require('../../models');
    var sortTypes       = require('../../models/customSort/sortTypes.json');
    var itemContentHelper = require('../../helpers/item-content');

    if(!req.body._collection || !req.body.type || !typeOk(req.body.type)){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        var item =  new models.Item();

        // if a specific displayMode is defined and is OK, update the item
        if(req.body.displayMode && displayModeOk(req.body.displayMode))
            item.displayMode = req.body.displayMode.id;

        // if description is defined, update the item
        if(req.body.description)
            item.description = req.body.description;

        // if title is defined, update the item
        if(req.body.title)
            item.title = req.body.title;

        // set the type of the item (itemType have been check before so it is safe to use it)
        item.type = req.body.type.id;

        models.Collection.findById(req.body._collection, function(err, collection){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(!collection) {res.status(400).send({ error: "cannot find collection with id: "+req.body._collection }); return;}
            if(collection._author!=req.user._id) {res.status(401).send({ error: "only the author of the collection can add item" }); return;}

            itemContentHelper.checkItemContent(item, req, function(err, content){
                if (err){res.status(400).send({ error: "error while creating item content"}); return;}
                if(!content && !item.description){res.status(400).send({ error: "you must add a description if there is no url"}); return;}
                if(content){
                    item.host = getHostFromItemContent(content);
                    item._content = content._id;
                }
                collection.addItem(item, function(err, item){
                    if(err) {console.log(err); res.sendStatus(500); return;}
                    addToCollectionItemsCustomSort(collection, item);
                });
            });

        });
    }

    function typeOk(reqType){
        if(itemTypes[reqType.id] != null)
            return true;
        return false;
    }

    function displayModeOk(reqDisplayMode){
        if(itemDisplayModes[reqDisplayMode.id] != null)
            return true;
        return false;
    }

    function addToCollectionItemsCustomSort(collection, item){
        models.CustomSort.findOneAndUpdate(
            {type: sortTypes.COLLECTION_ITEMS.id, _collection: collection._id},
            { $push: {
                ids: {
                    $each: [ item._id ],
                    $position: 0
                }
            }},
            function(err, customSort){
                if (err) {console.log(err); res.sendStatus(500); return;}
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

    function getHostFromUrl(url){
        var noHttpUrl = removeHttp(url);
        if(noHttpUrl)
            return noHttpUrl.split('/')[0]
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
         res.json({data: item});
    }
}
