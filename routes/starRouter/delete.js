module.exports = function (req, res) {

    var models          = require('../../models');

    models.Star.findById(req.params.star_id).populate('_collection').exec(function(err, star){
        if(err) {console.log(err); res.sendStatus(500); return;}
        if(!star) {console.log(err); res.sendStatus(400); return;}
        if(star._user != req.user._id) { res.status(401).send({error: "this star do not belong to you"}); return; }
        var collection = star._collection;
        models.Star.findById(req.params.star_id).remove(function(){
            collection.starsCount--;
            collection.save(function(err){
                if(err) {console.log(err); res.sendStatus(500); return;}
                res.end();
            })
        });
    })

}
