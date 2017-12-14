module.exports = function putActivate(req, res) {

    let async       = require('async');
    let models      = require('../../models');
    let mongodbid   = require('../../helpers/mongodbid');
    let lifeStates  = require('../../models/lifeStates.json');
    let collectionController = require('../../controllers/collectionController');

    models.User.findById(req.params.user_id, function(err, user) {
        if (err) {console.log(err); res.sendStatus(500); return;}
        if(!user) {res.status(404).send({ error: 'cannot find user with id: '+req.params.user_id}); return;}
        
        user.lifeState = lifeStates.ACTIVE.id;
        user.save(function(err){
            if(err) { return res.sendStatus(500); }

            let collectionFilterObj = {
                _author: user._id,
                lifeState: lifeStates.ARCHIVED_BY_ACCOUNT_DEACTIVATION.id,
            }

            models.Collection.find(collectionFilterObj).exec(function(err, collections){
                if(err) { console.log(err); return; }

                async.times(collections.length, function(n, next) {
                    collections[n].lifeState = lifeStates.ACTIVE.id;
                    collections[n].save(function(err){

                        let itemFilterObj = {
                            _collection: collections[n]._id,
                            lifeState: lifeStates.ARCHIVED_BY_ACCOUNT_DEACTIVATION.id,
                        }
                        models.Item.find(itemFilterObj).exec(function(err, items){
                            if(err) { console.log(err); return; }

                            for(let i in items){
                                items[i].lifeState = lifeStates.ACTIVE.id;
                                items[i].save(function(err){
                                })
                            }

                            if(err) next(err);
                            else next(null);

                        })

                    })
                }, function(err, results) {
                    if(err) res.json({success: false});
                    else res.json({success: true});
                });

            })

        })

    });
}
