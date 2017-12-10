var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ItemUrlSchema = require('./schema')(Schema);

ItemUrlSchema.pre('validate', function(next) {
	if(this.title)
    	this.title = this.title.substring(0, 500);
	if(this.url)
    	this.url = this.url.substring(0, 10000);
    next();
});

ItemUrlSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

ItemUrl = mongoose.model('ItemUrl', ItemUrlSchema);

exports.itemUrlModel = ItemUrl;
