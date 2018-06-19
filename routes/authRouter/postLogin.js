let m = require('../../models')

module.exports = function postLogin (req, res) {
  // set cookie maxAge
  req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000

  // send the user connected
  res.status(200).json(new m.ApiResponse(null, 200, req.user))
}
