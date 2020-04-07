let models = require('../../../models')
let itemTypes = require('../../../models/item/itemTypes.json')
let request = require('request')
const cheerio = require('cheerio')

module.exports = function createItemUrl (url, user, callback) {
  let host = getHost(url)
  url = getValidUrl(url)

  let options = {
    headers: {'user-agent': 'node.js'}
  }

  request(url, options, function (error, response, html) {
    let itemUrl = new models.ItemUrl()
    itemUrl.host = host
    itemUrl.url = url
    itemUrl._user = user._id

    if (error) {
      itemUrl.title = url
      itemUrl.save(function (err) {
        if (err) return callback(err)
        return callback(null, itemTypes.URL.id, itemUrl)
      })
    } else {
      let $ = cheerio.load(html)

      let img = $('meta[property="og:image"]').attr('content')
      if (img === '' || img === null || img === undefined) {
        img = $('meta[property="twitter:image"]').attr('content')
      }
      if (img === '' || img === null || img === undefined) {
        img = $('meta[property="twitter:image:src"]').attr('content')
      }
      if (img === '' || img === null || img === undefined) {
        img = $('img').first().attr('src')
      }

      if (img !== '' && img !== null && img !== undefined) {
        if (!(img.substring(0, 7) === 'http://' || img.substring(0, 8) === 'https://')) {
          if (img[0] === '/' && img[1] === '/') {
            img = 'http:' + img
          } else if (img[0] === '/') {
            img = 'http://' + host + img} else { img = 'http://' + host + '/' + img
          }
        }
        itemUrl.image = img
      }

      // itemUrl.title = $('meta[property="og:title"]').attr('content')
      // if (itemUrl.title === '' || itemUrl.title === null || itemUrl.title === undefined) {
      //   itemUrl.title = $('meta[property="twitter:title"]').attr('content')
      // }
      // if (itemUrl.title === '' || itemUrl.title === null || itemUrl.title === undefined) {
      //   itemUrl.title = $('title').text()
      // }
      //
      if ($('meta[property="og:title"]').length > 0) {
        title = $('meta[property="og:title"]').attr('content');
      } else if ($('meta[property="twitter:title"]').length > 0) {
        title = $('meta[property="twitter:title"]').attr('content');
      } else if ($('meta[name="title"]').length > 0) {
        title = $('meta[name="title"]').attr('content');
      } else if ($('meta[property="title"]').length > 0) {
        title = $('meta[property="title"]').attr('content');
      } else {
        title = $("title").text();
      }

      itemUrl.title = title;
      // console.log(itemUrl.title);
      // console.log($('meta[name="title"]').length);
      // console.log($('meta[name="title"]').attr('content'));
      // console.log($('meta[property="title"]').length);
      // console.log($('meta[property="title"]').attr('content'));

      itemUrl.description = $('meta[property="og:description"]').attr('content')
      if (itemUrl.description === '' || itemUrl.description === null || itemUrl.description === undefined) {
        itemUrl.description = $('meta[name="description"]').attr('content')
      }

      itemUrl.label1 = $('meta[name="twitter:label1"]').attr('value')
      if (itemUrl.label1 === '' || itemUrl.label1 === null || itemUrl.label1 === undefined) {
        itemUrl.label1 = $('meta[name="label1"]').attr('content')
      }

      itemUrl.value1 = $('meta[name="twitter:data1"]').attr('value')
      if (itemUrl.value1 === '' || itemUrl.value1 === null || itemUrl.value1 === undefined) {
        itemUrl.value1 = $('meta[name="data1"]').attr('content')
      }

      itemUrl.label2 = $('meta[name="twitter:label2"]').attr('value')
      if (itemUrl.label2 === '' || itemUrl.label2 === null || itemUrl.label2 === undefined) {
        itemUrl.label2 = $('meta[name="label1"]').attr('content')
      }

      itemUrl.value2 = $('meta[name="twitter:data2"]').attr('value')
      if (itemUrl.value2 === '' || itemUrl.value2 === null || itemUrl.value2 === undefined) {
        itemUrl.value2 = $('meta[name="data2"]').attr('content')
      }

      itemUrl.author = $('meta[property="author"]').attr('content')
      if (itemUrl.author === '' || itemUrl.author === null || itemUrl.author === undefined) {
        itemUrl.author = $('meta[name="author"]').attr('content')
      }
      if (itemUrl.author === '' || itemUrl.author === null || itemUrl.author === undefined) {
        itemUrl.author = $('meta[property="article:author"]').attr('content')
      }
      if (itemUrl.author !== undefined) {
        if (itemUrl.author.includes('http')) { itemUrl.author = $('meta[property="article:author"]').attr('content') }
      }

      itemUrl.type = $('meta[property="og:type"]').attr('content')

      itemUrl.site_name = $('meta[property="og:site_name"]').attr('content')

      itemUrl.save(function (err) {
        if (err) return callback(err)
        return callback(null, itemTypes.URL.id, itemUrl)
      })
    }
  })
}

function getHost (url) {
  let noHttpUrl = removeHttp(url)
  if (noHttpUrl) { return noHttpUrl.split('/')[0]} else { return 'null'}
}

function removeHttp (url) {
  if (url.substring(0, 7) === 'http://') {
    url = url.substr(7)
  } else if (url.substring(0, 8) === 'https://') {
    url = url.substr(8)
  }
  return url
}

function getValidUrl (url) {
  if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') { return url}
  return 'http://' + url
}
