let express    		= require('express');
let passport		= require('passport');
let ExpressBrute    = require('express-brute');
let isGranted       = require('../../security/isGranted');
let impersonate     = require('../../security/impersonate');
let router          = express.Router();
let store           = new ExpressBrute.MemoryStore();
let bruteforce      = new ExpressBrute(store);

router.route('/facebook')
    /**
     * @api {get} /auth/facebook Passport facebook
     * @apiPermission none
     * @apiName GetFacebook
     * @apiGroup Auth
     * @apiDescription Passport facebook authentication entry.
     */
    .get(function(req, res, next){
        let sess=req.session;
        sess.next = (req.query.next || '/dashboard');
        next();
    },passport.authenticate('facebook', {scope:['email']}))

router.route('/facebook/callback')
    /**
     * @api {get} /auth/facebook/callback Passport facebook callback
     * @apiPermission none
     * @apiName GetFacebookCallback
     * @apiGroup Auth
     * @apiDescription Passport facebook authentication callback.
     */
    .get(passport.authenticate('facebook', {failureRedirect: '/dashboard' }), function(req, res){
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        res.redirect(req.session.next);
    })

router.route('/twitter')
    /**
     * @api {get} /auth/twitter Passport twitter
     * @apiPermission none
     * @apiName GetTwitter
     * @apiGroup Auth
     * @apiDescription Passport twitter authentication entry.
     */
    .get(function(req, res, next){
        let sess=req.session;
        sess.next = (req.query.next || '/dashboard');
        next();
    },passport.authenticate('twitter'))

router.route('/twitter/callback')
    /**
     * @api {get} /auth/twitter/callback Passport twitter callback
     * @apiPermission none
     * @apiName GetTwitterCallback
     * @apiGroup Auth
     * @apiDescription Passport twitter authentication callback.
     */
    .get(passport.authenticate('twitter', {failureRedirect: '/dashboard'}), function(req, res){
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        res.redirect(req.session.next);
    })

router.route('/google')
    /**
     * @api {get} /auth/google Passport google
     * @apiPermission none
     * @apiName GetGoogle
     * @apiGroup Auth
     * @apiDescription Passport google authentication entry.
     */
    .get(function(req, res, next){
        let sess=req.session;
        sess.next = (req.query.next || '/dashboard');
        next();
    }, passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }))

router.route('/google/callback')
    /**
     * @api {get} /auth/google/callback Passport google callback
     * @apiPermission none
     * @apiName GetGoogleCallback
     * @apiGroup Auth
     * @apiDescription Passport google authentication callback.
     */
    .get(passport.authenticate('google', { failureRedirect: '/dashboard' }), function(req, res){
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        res.redirect(req.session.next);
    })

router.route('/unlink')
    /**
     * @api {put} /auth/unlink Unlink an account
     * @apiParam {String} type Type of auth strategy that you want to unlink (FACEBOOK, TWITER, GOOGLE).
     * @apiPermission ROLE_USER
     * @apiName UnlinkAccount
     * @apiGroup Auth
     * @apiSuccess {string} message A message about what happened.
     */
	.put(isGranted('ROLE_USER'), function(req, res){
        require('./putUnlinkAccount')(req, res);
    })

router.route('/login')
    /**
     * @api {post} /auth/login Login
     * @apiParam {String} username Email or username of the user.
     * @apiParam {String} password Password of the user.
     * @apiPermission none
     * @apiName Login
     * @apiGroup Auth
     * @apiSuccess {User} data The user connected.
     * @apiError (Error 401) Unauthorized Bad password or username
     */
    .post(bruteforce.prevent, impersonate(), passport.authenticate('local'), function(req, res){
        require('./postLogin')(req, res);
    })

router.route('/logout')
    /**
     * @api {get} /auth/logout Logout
     * @apiPermission none
     * @apiName Logout
     * @apiGroup Auth
     * @apiSuccess {boolean} success True if logout succeed, else false.
     */
    .get( function(req, res){
        require('./getLogout')(req, res)
    })

router.route('/currentuser')
    /**
     * @api {get} /auth/currentuser Get the current user
     * @apiPermission none
     * @apiName GetCurrentUser
     * @apiGroup Auth
     * @apiSuccess {User} data The connected user, if he's not connected, data = null.
     */
	.get(function(req,res){
        require('./getCurrentuser')(req, res);
    })

router.route('/signup')
    /**
     * @api {post} /auth/signup Signup
     * @apiParam {String} username A valid username.
     * @apiParam {String} email A valid email.
     * @apiParam {String} password A valid password.
     * @apiPermission none
     * @apiName Signup
     * @apiGroup Auth
     * @apiSuccess {User} data The new user.
     * @apiError (Error 400) Bad-Request Some required parameters was not provided
     * @apiError (Error 422) Unprocessable-Entity Email or username already taken or username is not valid.
     */
	.post(function(req,res){
        require('./postSignup')(req, res);
    })

router.route('/password/update')
    /**
     * @api {put} /api/auth/password/update Update a password
     * @apiParam {String} password User old password.
     * @apiParam {String} newPassword User new password.
     * @apiPermission ROLE_USER
     * @apiName UpdatePassword
     * @apiGroup Auth
     * @apiError (Error 400) Bad-Request Some required parameters was not provided.
     */
    .put(bruteforce.prevent, isGranted('ROLE_USER'), function(req,res){
        require('./putPasswordUpdate')(req, res);
    })

module.exports = router
