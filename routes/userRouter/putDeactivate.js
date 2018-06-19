module.exports = function putDeactivate (req, res) {
  let async = require('async')
  let models = require('../../models')
  let mongodbid = require('../../helpers/mongodbid')
  let lifeStates = require('../../models/lifeStates.json')
  let collectionController = require('../../controllers/collectionController')

  models.User.findById(req.params.user_id, function (err, user) {
    if (err) { console.log(err); res.sendStatus(500); return }
    if (!user) { res.status(404).send({ error: 'cannot find user with id: ' + req.params.user_id }); return }

    user.lifeState = lifeStates.ARCHIVED.id
    user.save(function (err) {
      if (err) { return res.sendStatus(500) }

      let collectionFilterObj = {
        _author: user._id,
        lifeState: lifeStates.ACTIVE.id
      }

      models.Collection.find(collectionFilterObj).exec(function (err, collections) {
        if (err) { console.log(err); return }

        async.times(collections.length, function (n, next) {
          collections[n].lifeState = lifeStates.ARCHIVED_BY_ACCOUNT_DEACTIVATION.id
          collections[n].save(function (err) {
            if (err) console.log(err)
            let itemFilterObj = {
              _collection: collections[n]._id,
              lifeState: lifeStates.ACTIVE.id
            }
            models.Item.find(itemFilterObj).exec(function (err, items) {
              if (err) { console.log(err); return }

              for (let i in items) {
                items[i].lifeState = lifeStates.ARCHIVED_BY_ACCOUNT_DEACTIVATION.id
                items[i].save(function (err) {
                  if (err) console.log(err)
                })
              }

              if (err) next(err)
              else next(null)
            })
          })
        }, function (err, results) {
          if (err) res.json({success: false})
          else res.json({success: true})
        })
      })
    })
  })
}
