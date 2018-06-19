module.exports = function getOne (req, res) {
  let collectionController = require('../../controllers/collectionController')

  collectionController.getOne(req.params.collection_id, req.query, req.user, function (apiResponse) {
    res.status(apiResponse.status).json(apiResponse)
  })
}
