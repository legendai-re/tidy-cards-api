let authController = require('../../controllers/authController')
let m = require('../../models')

module.exports = function postSignup (req, res) {
  let params = req.body

  // get session's language if exist
  params.language = (req.session.language || 'en')

  // create the new user
  authController.localSignup(params, function (apiResponse) {
    // stop and send error if user not created
    if (apiResponse.error) { return res.status(apiResponse.status).json(apiResponse) }

    // if user created, login the new user
    req.login(apiResponse.data, function (err) {
      if (err) {
        console.log(err)
        res.status(500).json(new m.ApiResponse(err, 500))
      } else {
        // send the new user connected
        res.status(200).json(new m.ApiResponse(null, 200, req.user))
      }
    })
  })
}
