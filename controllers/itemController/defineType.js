let itemTypes = require('../../models/item/itemTypes.json')

module.exports = function defineItemType (url) {
  if (!url) {
    return {error: 'no url'}
  } else {
    return {error: false, itemType: getItemType(url)}
  }
}

function getItemType (url) {
  if (simpleGetIsImage(url)) { return itemTypes['IMAGE'].id }
  if (getIsTweet(url)) { return itemTypes['TWEET'].id }
  if (getIsYoutube(url)) { return itemTypes['YOUTUBE'].id }
  return itemTypes['URL'].id
}

function simpleGetIsImage (url) {
  return (url.match(/\.(jpeg|jpg|gif|png)$/) !== null)
}

function getIsTweet (url) {
  let p = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(\w+)\/status(es)?\/(\d{18,19})(\/)?$/
  return !!(url.match(p))
}

function getIsYoutube (url) {
  return !!getYoutubeVideoId(url)
}

function getYoutubeVideoId (url) {
  let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  return (url.match(p)) ? RegExp.$1 : null
}
