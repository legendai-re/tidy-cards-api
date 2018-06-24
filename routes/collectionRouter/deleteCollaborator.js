module.exports = function put (req, res) {
  let models = require('../../models')
  let sortTypes = require('../../models/customSort/sortTypes.json')
  let logger = require('../../tools/winston')

  var q = models.Collection.findById(req.params.collection_id).populate('_collaborators')

  q.exec(function (err, collection) {
    if (err) { console.log(err); return res.sendStatus(500) };

    if (!collection) {
      res.status(404).send({error: 'cannot find collection with id: ' + req.params.collection_id})
      return
    }

    if (!collection.isCollaborator({_id: req.params.collaborator_id})) {
      return res.status(400).send({error: 'given collaborator_id is not a collaborator'})
    }

    var isAuthor = (collection._author.toString() === req.user._id.toString())
    var isTheCollaboratorToDelete = (req.user._id.toString() === req.params.collaborator_id)

    if (!isAuthor && !isTheCollaboratorToDelete) {
      return res.status(401).send({error: 'only the author of the collection or the collaborator to delete can do this'})
    }

    models.User.findById(req.params.collaborator_id, function (err, user) {
      if (err) { console.log(err); return res.sendStatus(500) };
      if (!user) { return res.status(404).send({error: 'cannot find user with id: ' + req.params.collaborator_id}) }
      // remove the user id from the collection _collaborators[]
      collection._collaborators.remove(user)
      collection.collaboratorsCount--
      collection.save(function (err) {
        if (err) { console.log(err); return res.sendStatus(500) };
        // remove the collection id from the user custom sort
        removeCollectionFromTheUserCustomSort(collection, user, function (err) {
          if (err) { console.log(err); return res.sendStatus(500) };
          res.json({data: collection})
        })
      })
    })
  })

  function removeCollectionFromTheUserCustomSort (collection, user, callback) {
    models.CustomSort.findOne({ _user: user._id, type: sortTypes.MY_COLLECTIONS.id }, function (err, customSort) {
      if (err) { logger.error(err); return callback(err) }
      if (!customSort) { return callback('cannot find custom sort object') }
      models.CustomSort.update({ _id: customSort._id }, { $pull: { ids: collection._id } }, function (err, result) {
        return callback(err)
      })
    })
  }
}
