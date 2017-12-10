var authController = require('../../controllers/authController');

module.exports = function putPasswordUpdate(req, res) {

    var params = req.body;
    var currentUser = req.user;

    authController.updatePassword(params, currentUser, function(apiResponse){
        res.status(apiResponse.status).json(apiResponse);
    })

}
