var mongoose = require('mongoose');
var forbiddenUsernames = require('./forbiddenUsernames');
var mongodbid   = require('../mongodbid');

var isValid = function(username){
    return (isValidFormat(username) && !isForbidden(username) && !mongodbid.isMongoId(username))
}

function isForbidden(username){
    return forbiddenUsernames.indexOf(username.toLowerCase()) > -1;
}

function isValidFormat(username){
    return new RegExp('^([0-9a-zA-Z-_.]{2,20})+$').test(username);
}

module.exports = {
    isValid: isValid
}
