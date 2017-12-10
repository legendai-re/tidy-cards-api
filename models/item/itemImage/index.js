var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ItemImageSchema = require('./schema')(Schema);

ItemImageSchema.pre('validate', function(next) {
	if(this.url)
    	this.url = this.url.substring(0, 10000);
    next();
});

ItemImageSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

ItemImage = mongoose.model('ItemImage', ItemImageSchema);

exports.itemImageModel = ItemImage;
