let models   = require('../../../models');
let itemTypes = require('../../../models/item/itemTypes.json');

module.exports = function createItemImage (url, user, callback) {

    let imageUrl = decodeURIComponent(url);
    let itemImage = new models.ItemImage();
    itemImage.url = imageUrl;
    itemImage.host = getHost(imageUrl);
    itemImage._user = user._id;
    itemImage.save(function(err){
        if(err) return callback(err);
        return callback(null, itemTypes.IMAGE.id, itemImage);
    });

    function getHost(url){
        let noHttpUrl = removeHttp(url);
        if(noHttpUrl)
            return noHttpUrl.split('/')[0];
        else
            return 'null';
    }

    function removeHttp(url){
        if(url.substring(0, 7) === 'http://'){
            url = url.substr(7);
        }else if(url.substring(0, 8) === 'https://'){
            url = url.substr(8);
        }
        return url;
    }
};