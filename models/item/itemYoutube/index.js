var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ItemYoutubeSchema = require('./schema')(Schema);

ItemYoutubeSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

ItemYoutube = mongoose.model('ItemYoutube', ItemYoutubeSchema);

exports.itemYoutubeModel = ItemYoutube;
