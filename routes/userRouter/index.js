let express    		= require('express');
let isGranted       = require('../../security/isGranted');

let router = express.Router();

router.route('/')
    /**
     * @api {get} /api/users Get multiple users
     * @apiParam {Number} skip=0 Skip x element.
     * @apiParam {Number} limit=20 Limit x element.
     * @apiParam {String} [sort_field] Field used to sort (sort_dir must be defined).
     * @apiParam {Number} [sort_dir] Sort direction (-1, 1) (sort_field must be defined).
     * @apiParam {String} [search] Search users with name or username containing the search param.
     * @apiPermission none
     * @apiName GetUsers
     * @apiGroup User
     * @apiSuccess {User[]} data Array of user.
     */
    .get(function(req, res){
        require('./getMultiple')(req, res);
    });


router.route('/:user_id')
    /**
     * @api {get} /api/users/:user_id Get one user
     * @apiParam {String} user_id User unique ID.
     * @apiPermission none
     * @apiName GetUser
     * @apiGroup User
     * @apiSuccess {User} data A user.
     */
    .get(function(req, res){
       require('./getOne')(req, res);
    })
    /**
     * @api {put} /api/users/:user_id Update a user
     * @apiParam {Number} user_id User unique ID.
     * @apiParam {String} [username] A valid username.
     * @apiParam {String} [email] A valid email.
     * @apiParam {String} [name] A valid name.
     * @apiParam {String} [bio] A short description about the user.
     * @apiParam {String} [language] A language ID.
     * @apiParam {Image} [_avatar] An image object to use as avatar.
     * @apiPermission ROLE_USER
     * @apiName PutUser
     * @apiGroup User
     * @apiSuccess {User} data A user updated.
     * @apiDescription You must be the user you plan to update or be granted admin to do this.
     */
    .put(isGranted('ROLE_USER'), function(req, res) {
        require('./put')(req, res);
    });

router.route('/:user_id/deactivate')
    /**
     * @api {put} /api/users/:user_id/deactivate Deactivate an account
     * @apiParam {Number} user_id User unique ID.
     * @apiPermission ROLE_ADMIN
     * @apiName DeactivateUser
     * @apiGroup User
     * @apiSuccess {Boolean} success True if account deactived.
     */
    .put(isGranted('ROLE_ADMIN'), function(req, res) {
        require('./putDeactivate')(req, res);
    });

router.route('/:user_id/activate')
    /**
     * @api {put} /api/users/:user_id/activate Reactivate an account
     * @apiParam {Number} user_id User unique ID.
     * @apiPermission ROLE_ADMIN
     * @apiName ActivateUser
     * @apiGroup User
     * @apiSuccess {Boolean} success True if account actived.
     */
    .put(isGranted('ROLE_ADMIN'), function(req, res) {
        require('./putActivate')(req, res);
    });

router.route('/helpers/valid-username')
    /**
     * @api {get} /api/users/helpers/valid-username Valid a username format
     * @apiParam {String} username The username that you want to valid.
     * @apiPermission none
     * @apiName GetValidUsername
     * @apiGroup User
     * @apiSuccess {boolean} isValid True if the username is valid, else false.
     */
    .get(function(req, res){
       require('./getValidUsername')(req, res);
    });


router.route('/helpers/valid-email')
    /**
     * @api {get} /api/users/helpers/valid-email Valid an email format
     * @apiParam {String} email The email that you want to valid.
     * @apiPermission none
     * @apiName GetValidEmail
     * @apiGroup User
     * @apiSuccess {boolean} isValid True if the email is valid, else false.
     */
    .get(function(req, res){
       require('./getValidEmail')(req, res);
    });

router.route('/helpers/confirm-email/:confirmation_token')
    /**
     * @api {put} /api/users/helpers/confirm-email/:confirmation_token Confirm an email
     * @apiParam {String} confirmation_token The conformation token.
     * @apiPermission ROLE_USER
     * @apiName GetConfirmEmail
     * @apiGroup User
     * @apiSuccess {boolean} success True if email confirmation succeed, else false.
     * @apiDescription You must be the user you plan to update or be granted admin to do this.
     */
    .put(isGranted('ROLE_USER'), function(req, res){
       require('./putConfirmEmail')(req, res);
    });

module.exports = router;
