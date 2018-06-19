let createItemImage = require('./createItemImage')
let createItemUrl = require('./createItemUrl')
let createItemTweet = require('./createItemTweet')
let createItemYoutube = require('./createItemYoutube')
let m = require('../../../models')

module.exports = function create (user, itemType, url, callback) {
  if (!url || !itemType) { return callback(new m.ApiResponse('url or itemType is missing', 400))}

  let afterItemCreatedCallback = function (err, itemType, itemContent) {
    if (err) return callback(new m.ApiResponse(err, 500))
    return callback(new m.ApiResponse(null, 200, {itemContent: itemContent, itemType: itemType}))
  }

  switch (itemType) {
    case 'IMAGE':
      return createItemImage(url, user, afterItemCreatedCallback)
    case 'YOUTUBE':
      return createItemYoutube(url, user, afterItemCreatedCallback)
    case 'TWEET':
      return createItemTweet(url, user, afterItemCreatedCallback)
    case 'URL':
      return createItemUrl(url, user, afterItemCreatedCallback)
    default:
      return afterItemCreatedCallback('unknown type')
  }
}
