module.exports = function createItemYoutube (url, user, callback) {

    var fs       = require("fs");
    var https    = require('https');
    var models   = require('../../models');
    var itemTypes = require('../../models/item/itemTypes.json');

    var videoId = getYoutubeVideoId(url);

    var options = {
      host: 'www.googleapis.com',
      path: '/youtube/v3/videos?part=snippet&id=' + videoId + '&key=' + process.env.GOOGLE_API_KEY
    };

    var ytCallback = function(response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var response = JSON.parse(str);
            var itemYoutube = new models.ItemYoutube();
            itemYoutube.url = 'https://youtu.be/'+videoId;
            itemYoutube.embedUrl = 'https://www.youtube.com/embed/'+videoId + '?autoplay=1';
            itemYoutube.videoId = videoId;
            if(response.items && response.items[0])
                itemYoutube.snippet = response.items[0].snippet;
            itemYoutube._user = user._id;
            itemYoutube.save(function(err){
                if(err)callback(err)
                callback(null, itemTypes.YOUTUBE.id, itemYoutube)
            })
        });

        response.on('error', function () {
            callback(JSON.parse(str))
        });
    };

    https.request(options, ytCallback).end();

    function getYoutubeVideoId(url) {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : null;
    }
}
