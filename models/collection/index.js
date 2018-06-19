let mongoose = require('mongoose')
let Schema = mongoose.Schema
let lifeStates = require('../lifeStates.json')
let visibility = require('./visibility.json')
let algoliaClient = require('../../tools/algolia/algolia')
let algoliaCollectionIndex = algoliaClient.initIndex('ts_' + process.env.ALGOLIA_INDEX_PREFIX + '_collection')

let CollectionSchema = require('./schema')(Schema)

CollectionSchema.pre('validate', function (next) {
  if (this.title) { this.title = this.title.substring(0, 100) }
  if (this.bio) { this.bio = this.bio.substring(0, 1000) }
  next()
})

CollectionSchema.pre('save', function (next) {
  if (!this.createdAt) { this.createdAt = new Date() }
  this.updatedAt = Date()
  next()
})

CollectionSchema.post('save', function (collection) {
  if (process.env.NODE_ENV == 'test') { return }
  if (collection.lifeState === lifeStates.ACTIVE.id && collection.visibility === visibility.PUBLIC.id) {
    algoliaCollectionIndex.addObject({
      objectID: collection._id,
      title: collection.title,
      bio: collection.bio
    }, function (err, content) {
      if (err) { console.log(err) }
    })
  } else {
    algoliaCollectionIndex.deleteObject(collection._id.toString(), function (err) {
      if (err) { console.log(err) }
    })
  }
})

/**
 * Add an item to a collection.
 * @function addItem
 * @param {Item} item - An object Item.
 * @param {requestCallback} callback - The callback that return the item.
 */
CollectionSchema.methods.addItem = function addItem (item, callback) {
  let tmpThis = this
  item._collection = this._id
  item.save(function (err) {
    if (err) { callback(err, item); return }
    tmpThis.itemsCount++
    tmpThis.save(function (err) {
      callback(err, item)
    })
  })
}

CollectionSchema.methods.isCollaborator = function isCollaborator (user) {
  for (let i = 0; i < this._collaborators.length; i++) {
    if (this._collaborators[i]._id.toString() === user._id.toString()) { return true }
  }
  return false
}

CollectionSchema.methods.haveEditRights = function haveEditRights (user) {
  let authorId
  if (this._author._id == undefined) { authorId = this._author } else { authorId = this._author._id }
  return authorId.toString() === user._id.toString() || this.isCollaborator(user)
}

Collection = mongoose.model('Collection', CollectionSchema)

exports.collectionModel = Collection
