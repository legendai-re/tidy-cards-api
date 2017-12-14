module.exports = function getMultiple (req, res) {

    let itemTypes       = require('../../models/item/itemTypes.json');
    let lifeStates      = require('../../models/lifeStates.json');
    let models          = require('../../models');
    let sortTypes       = require('../../models/customSort/sortTypes.json');
    let visibility      = require('../../models/collection/visibility.json');

    let rq = req.query;

    if(!rq._collection && (!req.user || !req.user.isGranted('ROLE_ADMIN'))){
        res.status(400).send({ error: "you must select a collection to get items (_collection) "});
        return;
    }

    if(rq.custom_sort){
        checkCollectionStateAndVisibility(manageCustomSort);
    }else{
        checkCollectionStateAndVisibility(manageNormalSort);
    };

    function checkCollectionStateAndVisibility(callback){
        models.Collection.findOne({_id: rq._collection}, function(err, collection){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(!collection || collection.lifeState == lifeStates.ARCHIVED.id)
                return res.sendStatus(404);
            if(collection.visibility == visibility.PRIVATE.id && (!req.user || collection._author != req.user._id))
                return res.sendStatus(401);
            callback();
        })
    }

    function manageCustomSort(){
        let skip = rq.skip ? parseInt(rq.skip) : 0;
        let limit = rq.limit ? parseInt(rq.limit) : 8;
        models.CustomSort.findOne({ _collection: rq._collection, type: sortTypes.COLLECTION_ITEMS.id},{ ids : { $slice : [skip , limit] } }, function(err, customSort){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(!customSort) { res.sendStatus(400); return;}
            let q = models.Item.find({_id: {$in: customSort.ids}, lifeState: lifeStates.ACTIVE.id });

            if(rq.populate){
                q.populate(rq.populate);
            }

            q.exec(function(err, items){
                if (err) {console.log(err); res.sendStatus(500); return;}
                for(let i in items){
                    items[i].position = customSort.ids.indexOf(items[i]._id) + skip;
                }
                if(items.length < 1) { res.json({data: []}); return};
                addItemsContent(0, items,  function(err, items){
                    res.json({data: items});
                })
            });
        })
    }

    function manageNormalSort(){
        getQueryFiler(rq, req, function(filterObj){
            let q = models.Item.find(filterObj).sort({'createdAt': 1}).limit(20);
            q.where('lifeState').equals(lifeStates.ACTIVE.id);

            if(rq.populate){
                q.populate(rq.populate);
            }

            if(rq.skip)
                q.skip(parseInt(rq.skip));

            if(rq.limit)
                q.limit(parseInt(rq.limit));

            if(rq.sort_field && rq.sort_dir && (parseInt(rq.sort_dir)==1 || parseInt(rq.sort_dir)==-1)){
                let sortObj = {};
                sortObj[rq.sort_field] = rq.sort_dir;
                q.sort(sortObj);
            }

            q.exec(function(err, items){
                if (err) {console.log(err); res.sendStatus(500); return;}
                if(items.length < 1) { res.json({data: []}); return};
                addItemsContent(0, items,  function(err, items){
                    res.json({data: items});
                })
            });
        });
    }

    function getQueryFiler(rq, req, callback){
        let filterObj = {};

        if(rq.search)
            filterObj.title = { $regex:  '.*'+rq.search+'.*', $options: 'i'};

        if(rq._collection){
            filterObj._collection = rq._collection;
            callback(filterObj);
        }else{
            filterObj.visibility = visibility.PUBLIC;
            callback(filterObj);
        }
    }

    function addItemsContent(i, items, callback){
        if(!items[i]){
            i++;
            if(i==items.length)
                return callback(null, items);
            else
                return addItemsContent(i, items, callback);
        }

        switch(items[i].type){
            case itemTypes.URL.id:
                models.ItemUrl.findById(items[i]._content, function(err, itemUrl){
                    items[i]._content = itemUrl;
                    i++;
                    if(i==items.length){
                        callback(null, items);
                    }else{
                        addItemsContent(i, items, callback);
                    }
                });
                break;
            case itemTypes.IMAGE.id:
                models.ItemImage.findById(items[i]._content, function(err, itemImage){
                    items[i]._content = itemImage;
                    i++;
                    if(i==items.length){
                        callback(null, items);
                    }else{
                        addItemsContent(i, items, callback);
                    }
                });
                break;
            case itemTypes.YOUTUBE.id:
                models.ItemYoutube.findById(items[i]._content, function(err, itemYoutube){
                    items[i]._content = itemYoutube;
                    i++;
                    if(i==items.length){
                        callback(null, items);
                    }else{
                        addItemsContent(i, items, callback);
                    }
                });
                break;
            case itemTypes.TWEET.id:
                models.ItemTweet.findById(items[i]._content, function(err, itemTweet){
                    items[i]._content = itemTweet;
                    i++;
                    if(i==items.length){
                        callback(null, items);
                    }else{
                        addItemsContent(i, items, callback);
                    }
                });
                break;
            case itemTypes.COLLECTION.id:
                let q = models.Collection.findById(items[i]._content);
                q.populate('_thumbnail');
                q.populate({
                    path: '_author',
                    populate: { path: '_avatar' }
                });
                q.exec(function(err, collection){
                    items[i]._content = collection;
                    i++;
                    if(i==items.length){
                        callback(null, items);
                    }else{
                        addItemsContent(i, items, callback);
                    }
                });
                break;
            case itemTypes.TEXT.id:
                i++;
                if(i==items.length){
                    callback(null, items);
                }else{
                    addItemsContent(i, items, callback);
                }
                break;
            default:
                console.log(items[i])
        }
    }

}
