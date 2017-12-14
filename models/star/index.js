let mongoose    = require('mongoose');
let Schema      = mongoose.Schema;

let StarSchema = require('./schema')(Schema);

StarSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

Star = mongoose.model('Star', StarSchema);

exports.starModel = Star;
