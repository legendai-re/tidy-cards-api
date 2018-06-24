module.exports = function put (req, res) {
  let models = require('../../models')
  let sortTypes = require('../../models/customSort/sortTypes.json')

  if (!req.body.collaboratorId) {
    res.status(400).send({ error: 'some required parameters was not provided' })
    res.end()
  } else {
    var q = models.Collection.findById(req.params.collection_id).populate('_collaborators')

    q.exec(function (err, collection) {
      if (err) { console.log(err); return res.sendStatus(500) };

      if (!collection) {
        res.status(404).send({error: 'cannot find collection with id: ' + req.params.collection_id})
        return
      }

      // if the currentUser is the author
      if (collection._author.toString() === req.user._id.toString()) {
        // stop if the collaborator is the author
        if (req.body.collaboratorId === req.user._id.toString()) {
          return res.status(400).send({error: 'the author cannot be a collaborator'})
        }

        // get the user from the db
        models.User.findById(req.body.collaboratorId, function (err, user) {
          if (err) { console.log(err); return res.sendStatus(500) };
          if (!user) { return res.status(404).send({error: 'cannot find user with id: ' + req.body.collaboratorId}) }
          // avoid to add the same collabotaror multiple times
          if (!collection.isCollaborator(user)) {
            collection._collaborators.push(user)
            collection.collaboratorsCount++
            collection.save(function (err) {
              if (err) { console.log(err); return res.sendStatus(500) };
              addCollectionToTheUserCustomSort(collection, user, function (err) {
                if (err) { console.log(err); return res.sendStatus(500) };
                res.json({data: collection})
              })
            })
          } else {
            res.json({data: collection})
          }
        })
      } else {
        return res.sendStatus(401)
      }
    })
  }

  function addCollectionToTheUserCustomSort (collection, user, callback) {
    models.CustomSort.findOneAndUpdate(
      {type: sortTypes.MY_COLLECTIONS.id, _user: user._id},
      { $push: {
        ids: {
          $each: [ collection._id ],
          $position: 0
        }
      }},
      function (err, customSort) {
        callback(err)
      }
    )
  }
}
