let https    = require('https');
let models   = require('../../../models');
let itemTypes = require('../../../models/item/itemTypes.json');

module.exports = function createItemTweet (url, user, callback) {

    let options = {
      host: 'publish.twitter.com',
      path: '/oembed?format=json&url='+ encodeURI(url)
    };

    let twCallback = function(response) {
        let str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            let response = JSON.parse(str);
            let itemTweet = new models.ItemTweet();
            itemTweet.url = response.url;
            itemTweet.html = response.html;
            itemTweet.author_name = response.author_name;
            itemTweet.author_url = response.author_url;
            itemTweet.width = response.width;
            itemTweet.height = response.height;
            itemTweet.type = response.type;
            itemTweet.provider_name = response.provider_name;
            itemTweet.version = response.version;
            itemTweet._user = user._id;
            itemTweet.save(function(err){
                if(err)callback(err);
                callback(null, itemTypes.TWEET.id, itemTweet)
            })
        });

        response.on('error', function () {
            callback(JSON.parse(str));
        });
    };

   https.request(options, twCallback).end();

};
