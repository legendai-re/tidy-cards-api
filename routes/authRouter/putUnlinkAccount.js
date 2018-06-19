let authController = require('../../controllers/authController')
let m = require('../../models')

module.exports = function putUnlinkAccount (req, res) {
  let params = req.body

  authController.unlinkSocialAccount(params, req.user, function (apiResponse) {
    res.status(apiResponse.status).json(apiResponse)
  })
}
