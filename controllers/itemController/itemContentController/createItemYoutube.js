let https = require('https')
let models = require('../../../models')
let itemTypes = require('../../../models/item/itemTypes.json')

module.exports = function createItemYoutube (url, user, callback) {
  let videoId = getYoutubeVideoId(url)

  let options = {
    host: 'www.googleapis.com',
    path: '/youtube/v3/videos?part=snippet&id=' + videoId + '&key=' + process.env.GOOGLE_API_KEY
  }

  let ytCallback = function (response) {
    let str = ''

    response.on('data', function (chunk) {
      str += chunk
    })

    response.on('end', function () {
      let response = JSON.parse(str)
      let itemYoutube = new models.ItemYoutube()
      itemYoutube.url = 'https://youtu.be/' + videoId
      itemYoutube.embedUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1'
      itemYoutube.videoId = videoId
      if (response.items && response.items[0]) { itemYoutube.snippet = response.items[0].snippet }
      itemYoutube._user = user._id
      itemYoutube.save(function (err) {
        if (err)callback(err)
        callback(null, itemTypes.YOUTUBE.id, itemYoutube)
      })
    })

    response.on('error', function () {
      callback(JSON.parse(str))
    })
  }

  https.request(options, ytCallback).end()

  function getYoutubeVideoId (url) {
    let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    return (url.match(p)) ? RegExp.$1 : null
  }
}
