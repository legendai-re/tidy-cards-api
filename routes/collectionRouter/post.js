module.exports = function post (req, res) {

    var visibility      = require('../../models/collection/visibility.json');
    var sortTypes       = require('../../models/customSort/sortTypes.json');
    var models          = require('../../models');

	if(!req.body.title || !req.body.color || !req.body.visibility || !visibilityOk(req.body.visibility)){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        createCollection(function(err, collection){
            if(err){
                return res.status(500).json(err);
            }else if(req.body._parent){
                if(process.env.NODE_ENV == 'production')
                    return res.status(403).send({error: 'sub collections are not ready for production yet'});
                getParent(function(err, parent){
                    if (err) {console.log(err); return res.sendStatus(500);}
                    collection._parent = parent._id;
                    collection.depth = parent.depth+1;
                    //if parent.deph == 0, the parent is the rootCollection
                    collection._rootCollection = (parent.depth == 0) ? parent._id : parent._rootCollection;
                    collection.visibility = parent.visibility;
                    collection.lifeState = 'PENDING_FOR_ITEM_RELATION';
                    saveSubCollection(collection);
                })
            }else{
                collection.depth = 0;
                saveRootCollection(collection);
            }
        });
    }

    function getParent(callback){
        models.Collection.findById(req.body._parent, function(err, collection){
            if(err) return callback(err);
            if(!collection) return callback('cannot find parent collection with id: '+req.body._parent);
            if(collection._author!=req.user._id) return callback('you\'re not the owner of the parent collection');
            callback(null, collection);
        })
    }

    function visibilityOk(reqVisibility){
        if(visibility[reqVisibility.id] != null)
            return true;
        return false;
    }

    function createCollection(callback){
        var collection =  new models.Collection();
        collection.title = req.body.title;
        collection.color = req.body.color;
        collection.visibility = req.body.visibility.id;
        if(req.body.bio){
            collection.bio = req.body.bio;
        }
        if(req.body._thumbnail && req.body._thumbnail._id){
            models.Image.checkIfOwner(req.body._thumbnail._id, req.user, function(err, isOwner){
                if(err) {console.log(err); return callback(err)}
                if(!isOwner) return callback({ error: 'cannot set image, you are not the owner of this image'});
                collection._thumbnail = req.body._thumbnail._id;
                callback(null,collection);
            })
        }else{
            callback(null,collection);
        }
    }

    function saveRootCollection(collection){
        req.user.addCollection(collection, function(err, collection){
            if (err) {console.log(err); res.sendStatus(500); return;}
            addToMyCollectionCustomSort(collection);
        });
    }

    function saveSubCollection(collection){
        collection._author = req.user._id;
        collection.save(function(err){
            if (err) {console.log(err); res.sendStatus(500); return;}
            createItemCustomSort(collection);
        });
    }

    function addToMyCollectionCustomSort(collection){
        models.CustomSort.findOneAndUpdate(
            {type: sortTypes.MY_COLLECTIONS.id, _user: req.user._id},
            { $push: {
                ids: {
                    $each: [ collection._id ],
                    $position: 0
                }
            }},
            function(err, customSort){
                if (err) {console.log(err); res.sendStatus(500); return;}
                createItemCustomSort(collection);
            }
        )
    }

    function createItemCustomSort(collection){
        var itemCustomSort = new models.CustomSort();
        itemCustomSort.type = sortTypes.COLLECTION_ITEMS.id;
        itemCustomSort._user = req.user._id;
        itemCustomSort._collection = collection._id;
        itemCustomSort.save(function(err){
            if (err) {console.log(err); res.sendStatus(500); return;}
            sendResponse(collection);
        });
    }

    function sendResponse(collection){
        res.json({'data': collection});
    }
}
