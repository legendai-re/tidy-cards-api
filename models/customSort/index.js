let mongoose    = require('mongoose');
let Schema      = mongoose.Schema;

let CustomSortSchema  = require('./schema')(Schema);

CustomSortSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

CustomSort = mongoose.model('CustomSort', CustomSortSchema);

exports.customSortModel = CustomSort;
