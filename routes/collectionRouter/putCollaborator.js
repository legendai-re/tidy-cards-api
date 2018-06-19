module.exports = function put (req, res) {

    let models = require('../../models');

    if(!req.body.collaboratorId){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{

        q = models.Collection.findById(req.params.collection_id).populate("_collaborators");

        q.exec(function (err, collection) {
            if(err) {console.log(err); return res.sendStatus(500)};

            if (!collection) {
                res.status(404).send({error: 'cannot find collection with id: ' + req.params.collection_id});
                return;
            }

            if (collection._author.toString() === req.user._id.toString()) {

                models.User.findById(req.body.collaboratorId, function (err, user) {
                    if(err) {console.log(err); return res.sendStatus(500)};
                    if (!user) {
                        return res.status(404).send({error: 'cannot find user with id: ' + req.body.collaboratorId});
                    }
                    if(!collection.isCollaborator(user)){
                        collection._collaborators.push(user);
                        collection.save(function (err) {
                            if(err) {console.log(err); return res.sendStatus(500)};
                            res.json({data: collection});
                        });
                    }else{
                        res.json({data: collection});
                    }

                });

            } else {
                return res.sendStatus(401);
            }
        });
    }

};