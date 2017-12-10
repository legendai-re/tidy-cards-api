var express         = require('express');
var isGranted       = require('../../security/isGranted');
var router          = express.Router();

router.route('/')
    .put(isGranted('ROLE_ADMIN'), function(req, res){
        require('./putRoles')(req, res);
    })
    .delete(isGranted('ROLE_ADMIN'), function(req, res){
        require('./deleteRoles')(req, res);
    });

module.exports = router;
