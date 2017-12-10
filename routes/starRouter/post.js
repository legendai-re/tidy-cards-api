module.exports = function post (req, res) {

    var visibility      = require('../../models/collection/visibility.json');
    var models          = require('../../models');

    if(!req.body._collection){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
        models.Collection.findById(req.body._collection, function(err, collection){
            if(err) {console.log(err); res.sendStatus(500); return;}
            if(!collection) {res.status(400).send({ error: "cannot find collection with id: "+req.body._collection }); return;}
            if(collection.visibility == visibility.PRIVATE.id) {res.status(400).send({ error: "cannot star a private collection" }); return;}

            models.Star.findOne({_collection: collection._id, _user: req.user._id}, function(err, star){
                if(err) {console.log(err); res.sendStatus(500); return;}
                if(star) {res.status(400).send({ error: "you have already starred this collection" }); return;}
                createStar(collection, req.user, function(err, star){
                    if(err) {console.log(err); res.sendStatus(500); return;}
                    res.json({data: star});
                })
            })
        })
    }

    function createStar(collection, user, callback){
        var star =  new models.Star();
        star._collection = collection._id;
        star._user = user._id;
        star.save(function(err){
            if(err) return callback(err);
            collection.starsCount++;
            collection.save(function(err){
                if(err) return callback(err);
                callback(null, star);
            })
        })
    }
}
