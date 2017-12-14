let express         = require('express');
let isGranted       = require('../../security/isGranted');

let router = express.Router();

router.route('/')
    /**
     * @api {post} /api/collections Create a new collection
     * @apiParam {String} title Title of the collection.
     * @apiParam {String} color Color of the collection.
     * @apiParam {Object} visibility An object that contain the visibility id.
     * @apiParam {String} [bio] A short description of the collection.
     * @apiParam {String} [_thumbnail] Id of the image to use as thumbnail.
     * @apiParam {String} [_parent] Id of the parent collection if you are creating a subcollection.
     * @apiPermission ROLE_USER
     * @apiName PostCollection
     * @apiGroup Collection
     * @apiSuccess {Collection} data The new collection.
     * @apiError (Error 400) Bad-Request Some required parameters was not provided
     */
    .post(isGranted('ROLE_USER'), function(req, res){
        require('./post')(req, res);
    })
    /**
     * @api {get} /api/collections Get multiple collections
     * @apiParam {Number} skip=0 Skip x element.
     * @apiParam {Number} limit=8 Limit x element.
     * @apiParam {String} [sort_field] Field used to sort (sort_dir must be defined).
     * @apiParam {Number} [sort_dir] Sort direction (-1, 1) (sort_field must be defined).
     * @apiParam {String} [search] Search collections with title or bio containing the search param.
     * @apiParam {String} [_author] User unique ID. To get collections created by this user.
     * @apiParam {String} [_starredBy] User unique ID. To get collections starred by this user.
     * @apiParam {Boolean} [custom_sort] To sort collections by user choice (_author must be defined).
     * @apiParam {Boolean} [isFeatured] To get featured collections.
     * @apiParam {Boolean} [isOnDiscover] To get collections on discover page.
     * @apiPermission none
     * @apiName GetCollections
     * @apiGroup Collection
     * @apiSuccess {Collection[]} data Array of collection.
     */
    .get(function(req, res){
        require('./getMultiple')(req, res);
    });

router.route('/:collection_id')
    /**
     * @api {get} /api/collections/:collections_id Get one collection
     * @apiParam {String} collection_id Collection unique ID.
     * @apiPermission none
     * @apiName GetCollection
     * @apiGroup Collection
     * @apiSuccess {Collection} data A collection.
     * @apiError (Error 401) Unauthorized Collection with this <code>collection_id</code> is archived or private.
     * @apiError (Error 404) Not-Found Cannot find collection with this <code>collection_id</code>.
     */
    .get(function(req, res){
       require('./getOne')(req, res);
    })
    /**
     * @api {put} /api/collections/:collections_id Update a collection
     * @apiParam {String} collection_id Collection unique ID.
     * @apiParam {String} [title] Title of the collection.
     * @apiParam {String} [color] Color of the collection.
     * @apiParam {Object} [visibility] An object that contain the visibility id.
     * @apiParam {String} [bio] A short description of the collection.
     * @apiParam {String} [_thumbnail] Id of the image to use as thumbnail.
     * @apiParam {Boolean} [updatePosition] Must be true if you plan to update position.
     * @apiParam {Number} [position] Position of the collection.
     * @apiParam {Boolean} [isFeatured] Featured this collections (must have ROLE_ADMIN).
     * @apiParam {Boolean} [isOnDiscover] Add collection on discover page (must have ROLE_ADMIN).
     * @apiPermission ROLE_USER
     * @apiName PutUpdateCollection
     * @apiGroup Collection
     * @apiSuccess {Collection} data A collection updated.
     * @apiDescription You must be the author of the collection or be granted admin to do this.
     */
    .put(isGranted('ROLE_USER'), function(req, res) {
        require('./put')(req, res);
    })
    /**
     * @api {delete} /api/collections/:collections_id Delete a collection
     * @apiParam {String} collection_id Collection unique ID.
     * @apiPermission ROLE_USER
     * @apiName DeleteCollection
     * @apiGroup Collection
     * @apiDescription You must be the author of the collection or be granted admin to do this.
     */
    .delete(isGranted('ROLE_USER'), function(req, res) {
        require('./delete')(req, res);
    });

module.exports = router;
