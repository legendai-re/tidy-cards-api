var multer          = require('multer')
var aws             = require('aws-sdk')
var multerS3        = require('multer-s3')
var request         = require('request');
var fs              = require('fs')
var gm              = require('gm'), imageMagick = gm.subClass({ imageMagick: true });
var async           = require('async')
var imagesTypes     = require('../../models/image/imageTypes.json');
var models          = require('../../models');

aws.config.region = 'eu-west-1';

var s3 = new aws.S3({params: {Bucket: process.env.S3_BUCKET}});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET+'/'+process.env.IMAGES_FOLDER,
    metadata: function (req, file, callback) {
      callback(null, {fieldName: file.fieldname});
    },
    key: function (req, file, callback) {

        var image = new models.Image();
        var type = getTypeFromReq(req);
        image.type = type.name;
        image.mime = getMimeFromFile(file);
        image._user = req.user._id;
        if(!image.type || !image.mime || image.mime=='false'){
            callback(true, null)
            return;
        }
        image.save(function(err){
            req.image = image;
            callback(null, type.path + '/soriginal/' + image._id + '.' + image.mime);
        });
    }
  })
});

function getTypeFromReq(req){
    var typeId = req.query.type;
    for(var key in imagesTypes){
        if(imagesTypes[key]._id == typeId)
            return imagesTypes[key];
    }
    console.log("Bad type");
    return false;
}

function getMimeFromFile(file){
    switch(file.mimetype){
        case 'image/jpeg':
            return 'jpeg';
        case 'image/png':
            return 'png';
        case 'image/gif':
            return 'gif';
        default :
            return false;
    }
}

var tmpPath = 'helpers/image-uploader/tmp-uploads/';

/**
 * Get the original image from AWS, then asynchronously crop the image and upload them to
 * AWS with the function awsUpload(). When all images are uploaded, call the callback
 */
function afterUpload(image, callback){
    var r = request(image.baseUrl + '/' + imagesTypes[image.type].path + '/s' + 'original' + '/' + image._id + '.' + image.mime)
                .pipe(fs.createWriteStream(tmpPath +'original/'+ image._id + '.' + image.mime ))
                .on('error', (e) => {console.log("pipe error");console.log(e); return callback(err);})

    r.on('finish', () => {
        gm(tmpPath +'original/'+ image._id + '.' +image.mime)
            .identify(function (err, data) {
                if (err) {console.log(err); return callback(err);}
                var sizes = imagesTypes[image.type].sizes;
                async.times(sizes.length, function(n, next) {
                    gm(tmpPath +'original/'+ image._id + '.' + image.mime)
                    .thumb(sizes[n].x,sizes[n].y, tmpPath +sizes[n].x+'x'+sizes[n].y+ '/'+ image._id + '.' +image.mime, 70, function(err, stdout, stderr, command){
                        awsUpload(image, sizes[n].x+'x'+sizes[n].y, function(err){
                            next(err);
                        });
                    })
                }, function(err, results) {
                    if(err){
                        console.log(err);
                        return callback(err);
                    }
                    fs.unlink(tmpPath + 'original/'+ image._id + '.' + image.mime, function(err){if(err)console.log(err)});
                    callback(null);
                });
            });
    });
}

/**
 * Upoad an image to AWS, when upload is finished, call the callback
 */
function awsUpload(image, size, callback){
    var imageLocalPath = tmpPath+size+'/'+ image._id + '.' +image.mime;
    fs.readFile(imageLocalPath, function(err, data) {
        if(err) return callback(err);
        s3.createBucket({Bucket: process.env.S3_BUCKET}, function() {
            var params = {Bucket: process.env.S3_BUCKET, Key: process.env.IMAGES_FOLDER+'/'+imagesTypes[image.type].path+'/s'+size+'/'+ image._id + '.' +image.mime, Body: data};
            s3.putObject(params, function(err, data) {
                if (err){
                    console.log(err);
                    return callback(err);
                }
                else{
                    fs.unlink(imageLocalPath, function(err){if(err)console.log(err)});
                    if(callback)callback();
                }
            });
        });
    });
}

/**
 * Get the image from a social network then call afterUpload()
 */
function getSocialNetworkAvatar(image, url, callback){
    var r = request(url)
                .pipe(fs.createWriteStream(tmpPath + 'original/'+ image._id + '.' + image.mime ))
                .on('error', (e) => {console.log("pipe error");console.log(e); return callback(err);})
    r.on('finish', () => {
        awsUpload(image, 'original', function(){
            afterUpload(image,function(err){
                return callback(err);
            });
        })
    })
}

module.exports = {
  upload: upload,
  afterUpload: afterUpload,
  getSocialNetworkAvatar: getSocialNetworkAvatar
};
