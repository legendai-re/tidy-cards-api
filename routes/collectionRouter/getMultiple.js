module.exports = function getMultiple (req, res) {

    let async       = require('async');
	let visibility  = require('../../models/collection/visibility.json');
    let sortTypes   = require('../../models/customSort/sortTypes.json');
    let lifeStates  = require('../../models/lifeStates.json');
    let models      = require('../../models');
    let algoliaClient = require('../../tools/algolia/algolia')
    let algoliaCollectionIndex = algoliaClient.initIndex('ts_'+process.env.ALGOLIA_INDEX_PREFIX+'_collection');
    
	let rq = req.query;

    if(rq._author && rq.custom_sort){
        let skip = rq.skip ? parseInt(rq.skip) : 0;
        let limit = rq.limit ? parseInt(rq.limit) : 8;
        models.CustomSort.findOne({ _user: rq._author, type: sortTypes.MY_COLLECTIONS.id},{ ids : { $slice : [skip , limit] } }, function(err, customSort){
            if(err || !customSort)
                return res.status(500).json({error: "cannot find customSort related to user: "+rq._author})
            let q = models.Collection.find({_id: {$in: customSort.ids}, lifeState: lifeStates.ACTIVE.id });
            q.populate('_thumbnail');
            q.populate({
                path: '_author',
                populate: { path: '_avatar' }
            });
            q.exec(function(err, collections){
                for(let i in collections){
                    collections[i].position = customSort.ids.indexOf(collections[i]._id) + skip;
                }
                if(req.user){
                    addIsStarred(req.user, collections, function(collectionsResult){
                        res.json({data: collections});
                    })
                }else{
                    res.json({data: collections});
                }
            });
        })
    }else if (rq._starredBy){
        let filterObj = {};
        let skip = rq.skip ? parseInt(rq.skip) : 0;
        let limit = rq.limit ? parseInt(rq.limit) : 8;

        let q = models.Star.find({_user: rq._starredBy}).limit(limit).skip(skip).sort({createdAt: -1});

        q.populate({
            path: '_collection',
            populate: {
                path: '_author',
                populate: { path: '_avatar' }
            }
        });
        q.populate({
            path: '_collection',
            populate: {
                path: '_thumbnail'
            }
        });

        q.exec(function(err, stars){
            if (err) {console.log(err); res.sendStatus(500); return;}
            let collections = [];
            stars.forEach(function(star) {
                collections.push(star._collection)
            });
            if(req.user){
                addIsStarred(req.user, collections, function(collectionsResult){
                    res.json({data: collections});
                })
            }else{
                res.json({data: collections});
            }            
        });

    }else{
    	getQueryFiler(rq, req, function(filterObj){
    		let q = models.Collection.find(filterObj).limit(20);
            q.where('lifeState').equals(lifeStates.ACTIVE.id);

    		q.populate('_thumbnail');
    		q.populate({
                path: '_author',
                populate: { path: '_avatar' }
            });

            if(rq.sort_field && rq.sort_dir && (parseInt(rq.sort_dir)==1 || parseInt(rq.sort_dir)==-1)){
                let sortObj = {};
                sortObj[rq.sort_field] = parseInt(rq.sort_dir);
                q.sort(sortObj);
            }

    		if(rq.skip)
    			q.skip(parseInt(rq.skip));

    		if(rq.limit)
    			q.limit(parseInt(rq.limit));

    		q.exec(function(err, collections){
    	    	if (err) {console.log(err); res.sendStatus(500); return;}
                if(req.user){
                    addIsStarred(req.user, collections, function(collectionsResult){
                        res.json({data: collections});
                    })
                }else{
                    res.json({data: collections});
                }
    	    });
    	})
    }

	function getQueryFiler(rq, req, callback){
		let filterObj = {};

        if(!rq.search)
            filterObj.depth = 0;
        if(rq.isFeatured)
            filterObj.isFeatured = true;
        if(rq.isOnDiscover)
            filterObj.isOnDiscover = true;

        if(rq.search){
            algoliaGetCollectionIds(decodeURIComponent(rq.search), function(ids){                
                filterObj._id = { '$in': ids }; 
                callback(filterObj);  
            })
        } else if(rq._author){
			filterObj._author = rq._author;
			if(req.user && req.user.isGranted('ROLE_USER'))
				filterObj.$or = [{visibility: visibility.PUBLIC.id}, {_author: req.user._id}]
			else
				filterObj.visibility = visibility.PUBLIC.id;
			callback(filterObj);
		}else{
			filterObj.visibility = visibility.PUBLIC.id;
			callback(filterObj);
		}
	}

    function algoliaGetCollectionIds(searchQuery, callback){
        algoliaCollectionIndex.search(
        {
            query: searchQuery,
            attributesToRetrieve: ['objectID'],
            hitsPerPage: 20,
        },
        function searchDone(err, content) {
            if (err) {
              console.error(err);
              callback([]);
            }
            let collectionsIds = [];
            for (let h in content.hits) {
                collectionsIds.push(content.hits[h].objectID)
            }
            callback(collectionsIds);
        });
    }

    function addIsStarred(user, collections, callback){
        async.times(collections.length, function(n, next) {
            models.Star.findOne({_user: user._id, _collection: collections[n]._id}, function(err, star){
                if(star)next(err, star);
                else next(err, null);
            })
        }, function(err, results) {
            for(let i in results){
                collections[i]._star = results[i];
            }
           callback(collections);
        });
    }
}
