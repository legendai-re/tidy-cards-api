var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var ItemTweetSchema = require('./schema')(Schema);

ItemTweetSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

ItemTweet = mongoose.model('ItemTweet', ItemTweetSchema);

exports.itemTweetModel = ItemTweet;
