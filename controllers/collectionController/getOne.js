var logger      = require('../../tools/winston');
var visibility  = require('../../models/collection/visibility.json');
var lifeStates  = require('../../models/lifeStates.json');
var m           = require('../../models');
var mongodbid   = require('../../helpers/mongodbid');

module.exports = function getOne(collection_id, params, currentUser, callback) {

    if(!mongodbid.isMongoId(collection_id))
        return callback(new m.ApiResponse(collection_id + ' is not a mongodb id', 404));

	var q = m.Collection.findById(collection_id);

	q.populate('_thumbnail');
    q.populate({
        path: '_author',
        populate: { path: '_avatar' }
    });

	q.exec(function(err, collection){
        if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500))}
        if(!collection) {return callback(new m.ApiResponse('cannot find collection with id: '+collection_id, 404));}

        var _authorId = collection._author._id ? collection._author._id : collection._author;

        // if collection no more active or private, and current currentUser is not the author
        if((collection.lifeState != lifeStates.ACTIVE.id) ||  (collection.visibility == visibility.PRIVATE.id && (!currentUser || String(currentUser._id)!=_authorId))){
        	if(currentUser){
                getStar(currentUser, collection, function(err, star){
                    if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500))}
                    return callback(new m.ApiResponse(null, 401, {_star: star}));
                })
            }else{
                return callback(new m.ApiResponse(null, 401, {_star: null}));
            }
        }else{
            getParents(collection, [], function(err, parentCollections){
                if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500))}
                collection._parents = parentCollections;
                if(currentUser){
                    getStar(currentUser, collection, function(err, star){
                        if(err) {logger.error(err); return callback(new m.ApiResponse(err, 500))}
                        collection._star = star;
                        return callback(new m.ApiResponse(null, 200, collection));
                    })
                }else{
                    return callback(new m.ApiResponse(null, 200, collection));
                }
            })
        }
    })

}

/**
 * Retrieve the parent collection of the collection passed in parameter,
 * this parent if then added to the an array 'result'.
 * This method is recurisve, all parents are stored in the array 'result'
 * at the end, it is then returned through the callback
 */
function getParents(collection, result, callback){
    if(!collection._parent) return callback(null, result);
    m.Collection.findById(collection._parent, function(err, parentCollection){
        result.push(parentCollection);
        if(!parentCollection._parent) return callback(null, result);
        return getParents(parentCollection, result, callback);
    })
}

/**
 * Retrieve the Star object related to the collection and the currentcurrentUser
 */
function getStar(currentUser, collection, callback){
    m.Star.findOne({_currentUser: currentUser._id, _collection: collection._id}, function(err, star){
        if(err) {logger.error(err); callback(err, null);}
        callback(null, star);
    })
}