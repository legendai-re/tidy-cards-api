module.exports = function createItemImage (url, user, callback) {

    var fs       = require("fs");
    var https    = require('https');
    var models   = require('../../models');
    var itemTypes = require('../../models/item/itemTypes.json');

    var imageUrl = url;
    var itemImage = new models.ItemImage();
    itemImage.url = decodeURIComponent(imageUrl);
    itemImage._user = user._id;
    itemImage.save(function(err){
        if(err) return callback(err);
        return callback(null, itemTypes.IMAGE, itemImage);
    })

}
