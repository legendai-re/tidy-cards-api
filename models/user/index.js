var mongoose    = require('mongoose');
var roles       = require('../../security/roles.json');
var visibility  = require('../collection/visibility.json');
var lifeStates  = require('../lifeStates.json');
var URLSlugs    = require('../../helpers/user/mongooseSlug');
var Schema      = mongoose.Schema;
var algoliaClient = require('../../tools/algolia/algolia')
var algoliaUserIndex = algoliaClient.initIndex('ts_'+process.env.ALGOLIA_INDEX_PREFIX+'_user');

var UserSchema  = require('./schema')(Schema);

UserSchema.pre('validate', function(next) {
    if(this.name)
        this.name = this.name.substring(0, 30);
    if(this.bio)
        this.bio = this.bio.substring(0, 1000);
    next();
});

UserSchema.pre('save', function(next) {
    if(!this.createdAt)
        this.createdAt = new Date();
    this.updatedAt = Date();
    next();
});

UserSchema.post('save', function(user) {
    if(process.env.NODE_ENV == 'test')
        return;
    if(user.lifeState === lifeStates.ACTIVE.id) {
        algoliaUserIndex.addObject({
            objectID: user._id,
            username: user.username,
            name: user.name
        }, function(err, content) {
            if(err)
                console.log(err)
        });
    }else{
        algoliaUserIndex.deleteObject(user._id.toString(), function(err) {
            if(err)
                console.log(err);
        });
    }
});

UserSchema.plugin(URLSlugs('unsafeUsername', {field: 'username', update: true}));

UserSchema.methods.isGranted = function isGranted(role){
    if(this.haveRole(role)) return true;
    return checkRole(this, role);
}

UserSchema.methods.haveRole = function haveRole(role){
    return this.roles.indexOf(role) > -1;
}

function checkRole(user, toFound){
    for(role in roles){
        if((roles[role].indexOf(toFound) > -1)){
            if(user.haveRole(role))return true;
            else return checkRole(user, role);
        }
    }
    return false;
}

UserSchema.methods.addRole = function addRole(role, callback) {
    if(!this.haveRole(role)){
        this.roles.push(role);
        this.save(function(err){
            if(err)throw err;
            callback({success: true, alert: "Role "+ role + " added."});
        })
    }else{
        callback({success: false, alert: "Role already exist"});
    }
}

UserSchema.methods.removeRole = function removeRole(role, callback) {
    if(this.haveRole(role) && role != "ROLE_USER"){
        var index = this.roles.indexOf(role);
        this.roles.splice(index, 1);
        this.save(function(err){
            if(err)throw err;
            callback({success: true, alert: "Role "+ role + " removed."});
        })
    }else{
        callback({success: false, alert: "Role didn't exist or you tryed to remove ROLE_USER"});
    }
}

UserSchema.methods.addCollection = function addCollection(collection, callback) {
    collection._author = this._id;
    collection.save(function(err){
        if (err) {callback(err, collection); return;}
        callback(false, collection);
    });
}

User = mongoose.model('User', UserSchema);

exports.userModel = User;
