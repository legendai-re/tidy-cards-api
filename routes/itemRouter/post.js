let models         = require('../../models');
let itemController = require("../../controllers/itemController")

module.exports = function post (req, res) {

    itemController.create(
        req.user,
        req.body._collection,
        req.body.displayMode,
        req.body.description,
        req.body.title,
        req.body.type,
        req.body._content,
        req.body.url,
        function(apiResponse){
            res.status(apiResponse.status).json(apiResponse);
        }
    );

};
