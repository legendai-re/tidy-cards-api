var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ImageSchema  = require('./schema')(Schema);

ImageSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

ImageSchema.virtual('baseUrl').get(function () {
   return process.env.IMAGES_URL + process.env.IMAGES_FOLDER;
});

ImageSchema.statics.checkIfOwner = function(imageId, user, callback){
    this.findById(imageId).exec(function(err, image){
        if(err) {console.log(err); return callback(err)}
        if(!image) return callback(null, false);
        if(image._user!=user._id) return callback(null, false);
        callback(null, true);
    })
}

Image = mongoose.model('Image', ImageSchema);

exports.imageModel = Image;
