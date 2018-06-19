let itemTypes = require('../../../models/item/itemTypes.json')
let models = require('../../../models')

module.exports = function checkItemContent (user, itemType, itemContent, finalCallback) {
  if (!(itemTypes[itemType] !== null)) {
    return finalCallback('unknown type', null)
  } else if (itemType === itemTypes.TEXT.id || !itemContent) {
    return finalCallback(null, null)
  } else {
    checkItemByType(user, itemType, itemContent, function (err, user, itemContent) {
      if (err) return finalCallback(err)
      if (!itemContent) return finalCallback('itemContent : cannot find itemContent')
      return finalCallback(null, itemContent)
    })
  }
}

function checkItemByType (user, itemType, itemContent, callback) {
  switch (itemType) {
    case itemTypes.URL.id:
      models.ItemUrl.findById(itemContent._id, function (err, itemContent) {
        callback(err, user, itemContent)
      })
      break
    case itemTypes.IMAGE.id:
      models.ItemImage.findById(itemContent._id, function (err, itemContent) {
        callback(err, user, itemContent)
      })
      break
    case itemTypes.YOUTUBE.id:
      models.ItemYoutube.findById(itemContent._id, function (err, itemContent) {
        callback(err, user, itemContent)
      })
      break
    case itemTypes.TWEET.id:
      models.ItemTweet.findById(itemContent._id, function (err, itemContent) {
        callback(err, user, itemContent)
      })
      break
    case itemTypes.COLLECTION.id:
      models.Collection.findById(itemContent._id, function (err, collection) {
        callback(err, user, collection)
      })
  }
}
