let itemContentController = require('../../../controllers/itemController/itemContentController')

module.exports = function post (req, res) {
  itemContentController.create(
    req.user,
    req.itemType,
    req.body.url,
    function (apiResponse) {
      res.status(apiResponse.status).json(apiResponse)
    }
  )
}
