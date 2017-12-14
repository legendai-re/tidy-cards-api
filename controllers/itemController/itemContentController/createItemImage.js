let models   = require('../../../models');
let itemTypes = require('../../../models/item/itemTypes.json');

module.exports = function createItemImage (url, user, callback) {

    let imageUrl = url;
    let itemImage = new models.ItemImage();
    itemImage.url = decodeURIComponent(imageUrl);
    itemImage._user = user._id;
    itemImage.save(function(err){
        if(err) return callback(err);
        return callback(null, itemTypes.IMAGE.id, itemImage);
    })

};
