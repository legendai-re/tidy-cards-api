let express = require('express')

let router = express.Router()

router.route('/charge')
  .post(function (req, res) {
    require('./postCharge')(req, res)
  })

module.exports = router
