var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var lifeStates  = require('../lifeStates.json');
var visibility  = require('./visibility.json');
var algoliaClient = require('../../tools/algolia/algolia')
var algoliaCollectionIndex = algoliaClient.initIndex('ts_'+process.env.ALGOLIA_INDEX_PREFIX+'_collection');

var CollectionSchema = require('./schema')(Schema);

CollectionSchema.pre('validate', function(next) {
    if(this.title)
        this.title = this.title.substring(0, 100);
    if(this.bio)
        this.bio = this.bio.substring(0, 1000);
    next();
});

CollectionSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

CollectionSchema.post('save', function(collection) {
    if(process.env.NODE_ENV == 'test')
        return;
    if(collection.lifeState === lifeStates.ACTIVE.id && collection.visibility === visibility.PUBLIC.id) {
        algoliaCollectionIndex.addObject({
            objectID: collection._id,
            title: collection.title,
            bio: collection.bio
        }, function(err, content) {
            if(err)
                console.log(err)
        });
    }else{
        algoliaCollectionIndex.deleteObject(collection._id.toString(), function(err) {
            if(err)
                console.log(err);
        });
    }
});

/**
 * Add an item to a collection.
 * @function addItem
 * @param {Item} item - An object Item.
 * @param {requestCallback} callback - The callback that return the item.
 */
CollectionSchema.methods.addItem = function addItem(item, callback) {
    var tmpThis = this;
    item._collection = this._id;
    item.save(function(err){
        if (err) {callback(err, item); return;}
        tmpThis.itemsCount++;
        tmpThis.save(function(err){
            callback(err, item);
        });
    });
}

Collection = mongoose.model('Collection', CollectionSchema);

exports.collectionModel = Collection;
