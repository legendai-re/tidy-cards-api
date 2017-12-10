var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var StarSchema = require('./schema')(Schema);

StarSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

Star = mongoose.model('Star', StarSchema);

exports.starModel = Star;
