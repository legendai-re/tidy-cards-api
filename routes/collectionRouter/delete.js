module.exports = function deleteOne (req, res) {

    var collectionController = require('../../controllers/collectionController');

    collectionController.deleteOne(req.user, req.params.collection_id, function(apiResponse){
        res.status(apiResponse.status).json(apiResponse);
    });

}
