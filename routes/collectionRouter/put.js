module.exports = function put (req, res) {
  let visibility = require('../../models/collection/visibility.json')
  let sortTypes = require('../../models/customSort/sortTypes.json')
  let displayMode = require('../../models/collection/displayMode.json')
  let models = require('../../models')

  q = models.Collection.findById(req.params.collection_id).populate('_collaborators')

  q.exec(function (err, collection) {
    if (err) { console.log(err); res.sendStatus(500); return }
    if (!collection) { res.status(404).send({ error: 'cannot find collection with id: ' + req.params.collection_id }); return }
    if (collection.haveEditRights(req.user) || req.user.isGranted('ROLE_ADMIN')) {
      if (req.user.isGranted('ROLE_ADMIN')) {
        collection.featuredAt = req.body.isFeatured ? new Date() : null
        collection.isFeatured = req.body.isFeatured
        collection.isOnDiscover = req.body.isOnDiscover
      }

      if (req.body.visibility && visibilityOk(req.body.visibility) && collection.depth == 0) {
        collection.visibility = req.body.visibility
        updateChildsVisibility(collection, req.body.visibility)
      }

      if (req.body.displayMode && displayModeOk(req.body.displayMode)) { collection.displayMode = req.body.displayMode }

      collection.title = (req.body.title || collection.title)
      collection.color = (req.body.color || collection.color)
      collection.bio = typeof req.body.bio !== 'undefined' ? req.body.bio : collection.bio

      if (req.body.updatePosition && typeof req.body.position !== 'undefined') { updatePosition(collection, req.body.position) } else if (req.body._thumbnail && req.body._thumbnail._id) { saveThumbnail(collection, req.body._thumbnail._id, req.user) } else { saveCollectionAndSendRes(collection) }
    } else {
      return res.sendStatus(401)
    }
  })

  function visibilityOk (reqVisibility) {
    if (visibility[reqVisibility] != null) { return true }
    return false
  }

  function displayModeOk (reqDisplayMode) {
    if (displayMode[reqDisplayMode] != null) { return true }
    return false
  }

  function saveThumbnail (collection, imageId, user) {
    models.Image.checkIfOwner(imageId, user, function (err, isOwner) {
      if (err) { console.log(err); res.sendStatus(500); return }
      if (!isOwner) return res.status(422).send({ error: 'cannot update avatar, you are not the owner of this image'})
      collection._thumbnail = imageId
      saveCollectionAndSendRes(collection)
    })
  }

  function updatePosition (collection, newPosition) {
    models.CustomSort.findOne({ _user: collection._author, type: sortTypes.MY_COLLECTIONS.id}, function (err, customSort) {
      if (err) { console.log(err); res.sendStatus(500); return }
      // remove id of collection
      models.CustomSort.update({ _id: customSort._id}, { $pull: { ids: collection._id } }, function (err, result) {
        if (err) { console.log(err); res.sendStatus(500); return }
        // add id at the new position
        models.CustomSort.update({_id: customSort._id}, { $push: { ids: { $each: [ collection._id ], $position: newPosition } } }, function (err, result) {
          if (err) { console.log(err); res.sendStatus(500); return }
          saveCollectionAndSendRes(collection)
        }
        )
      })
    })
  }

  function updateChildsVisibility (collection, visibility) {
    models.Collection.update({_rootCollection: collection._id}, {visibility: visibility}, {multi: true}, function (err) {
      if (err)console.log(err)
    })
  }

  function saveCollectionAndSendRes (collection) {
    collection.save(function (err) {
      if (err) { console.log(err); res.sendStatus(500); return }
      res.json({data: collection})
    })
  }
}
