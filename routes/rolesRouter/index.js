let express         = require('express');
let isGranted       = require('../../security/isGranted');
let router          = express.Router();

router.route('/')
    .put(isGranted('ROLE_ADMIN'), function(req, res){
        require('./putRoles')(req, res);
    })
    .delete(isGranted('ROLE_ADMIN'), function(req, res){
        require('./deleteRoles')(req, res);
    });

module.exports = router;
