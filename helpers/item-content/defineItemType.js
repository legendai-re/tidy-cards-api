module.exports = function defineItemType() {
    return function(req, res, next) {

        var itemTypes = require('../../models/item/itemTypes.json');

        if(!req.body.url){
            res.status(400).send({ error: 'some required parameters was not provided'});
            res.end();
        }else{
            var url = req.body.url;
            req.itemType = getItemType(url);
            next();
        }

        function getItemType(url){
            if(simpleGetIsImage(url))
                return itemTypes['IMAGE'];
            if(getIsTweet(url))
                return itemTypes['TWEET'];
            if(getIsYoutube(url))
                return itemTypes['YOUTUBE'];
            return itemTypes['URL'];
        }

        function simpleGetIsImage(url){
            return(url.match(/\.(jpeg|jpg|gif|png)$/) !== null);
        }

        function getIsTweet(url){
            var p = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/(\w+)\/status(es)?\/(\d{18})(\/)?$/;
            return (url.match(p)) ? true : false;
        }

        function getIsYoutube(url){
            return getYoutubeVideoId(url) ? true : false;
        }

        function getYoutubeVideoId(url) {
            var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            return (url.match(p)) ? RegExp.$1 : null;
        }
    }
}
