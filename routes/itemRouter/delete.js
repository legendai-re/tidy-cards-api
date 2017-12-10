module.exports = function (req, res) {

    var itemController  = require('../../controllers/itemController');

    itemController.deleteOne(req.user, req.params.item_id, function(apiResponse){
        res.status(apiResponse.status).json(apiResponse);
    })

}
