var authController = require('../../controllers/authController');
var m              = require('../../models');

module.exports = function putUnlinkAccount(req, res) {

    var params = req.body;

    authController.unlinkSocialAccount(params, req.user, function(apiResponse){
        res.status(apiResponse.status).json(apiResponse);
    })
}
