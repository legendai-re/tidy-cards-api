let authController = require('../../controllers/authController')

module.exports = function putPasswordUpdate (req, res) {
  let params = req.body
  let currentUser = req.user

  authController.updatePassword(params, currentUser, function (apiResponse) {
    res.status(apiResponse.status).json(apiResponse)
  })
}
