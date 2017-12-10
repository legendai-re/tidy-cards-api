module.exports = function post (req, res, next) {

    var itemTypes = require('../../../models/item/itemTypes.json');
    var itemContentHelper = require('../../../helpers/item-content');

    if(!req.body.url || !req.itemType){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{

        var url = req.body.url;
        var callback = function(err, itemType, itemContent){
            if(err) { return res.json({error: true, data: null})}
            res.json({error: false, data: itemContent, itemType: itemType});
        }

        switch(req.itemType.id){
            case 'IMAGE':
                return itemContentHelper.createItemImage(url, req.user, callback);
            case 'YOUTUBE':
                return itemContentHelper.createItemYoutube(url, req.user, callback);
            case 'TWEET':
                return itemContentHelper.createItemTweet(url, req.user, callback);
            case 'URL':
                return itemContentHelper.createItemUrl(url, req.user, callback);
            default:
                return res.json({error: true, data: null, message: 'unknow type'});
        }
    }

}
