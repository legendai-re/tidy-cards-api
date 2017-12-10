var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ItemSchema = require('./schema')(Schema);

ItemSchema.pre('validate', function(next) {
	if(this.title)
    	this.title = this.title.substring(0, 500);
    if(this.host)
    	this.host = this.host.substring(0, 500);
	if(this.description)
    	this.description = this.description.substring(0, 10000);
    next();
});

ItemSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

Item = mongoose.model('Item', ItemSchema);

exports.itemModel = Item;
