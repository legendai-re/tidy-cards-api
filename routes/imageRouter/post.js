module.exports = function post (req, res) {

    let imageUploader = require('../../helpers/image-uploader');
    if(req.image){
        imageUploader.afterUpload(req.image, function(err){
            res.json({data: req.image});
        });
    }else{
        res.status(422).send({ error: 'error, image not correctly created'});
    }

}
