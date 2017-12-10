var express    		= require('express');
var isGranted       = require('../../security/isGranted');
var imageUploader   = require('../../helpers/image-uploader');

var router = express.Router();

var upload = imageUploader.upload.single('file');

router.route('/')
    .post(isGranted('ROLE_USER'), function (req, res, next) {
        upload(req, res, function (err) {
            if (err) {
                res.status(422).send({ error: 'not an image'});
                return;
            }else{
                next();
            }
        })
    }, function(req, res){
        require('./post')(req, res);
    })
    .get(function(req, res){
       require('./getOne')(req, res);
    })

module.exports = router;
