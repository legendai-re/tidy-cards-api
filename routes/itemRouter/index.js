let express         = require('express');
let isGranted       = require('../../security/isGranted');
let defineItemTypeMiddleware  = require('../../controllers/itemController/defineTypeMiddleware');
let router          = express.Router();

router.route('/content/create')
    /**
     * @api {post} /api/items/content/create Create item's content
     * @apiParam {String} url An url.
     * @apiParam {Object} itemType An object that contain de id of the item type.
     * @apiPermission ROLE_USER
     * @apiName CreateItemContent
     * @apiGroup Item
     * @apiSuccess {Boolean} error True if an error appeared, else false.
     * @apiSuccess {ItemContent} data An object (ItemYoutube, ItemUrl, ItemTweet, ItemImage).
     * @apiSuccess {ItemType} itemType An object that contain de id of the item type.
     */
    .post(isGranted('ROLE_USER'), defineItemTypeMiddleware(), function(req, res){
       require('./itemContent/post')(req, res);
    });

router.route('/')
    /**
     * @api {post} /api/items Create an item
     * @apiParam {String} _collection The ID of the collection that the item will belong.
     * @apiParam {String} [title] Title of the item.
     * @apiParam {String} [type] The item type, <code>_content</code> must be defined.
     * @apiParam {ItemContent} [_content] An object (ItemYoutube, ItemUrl, ItemTweet, ItemImage), must be defined if <code>description</code> isn't. <code>type</code> must be defined.
     * @apiParam {String} [url] An url, it will be used to generate the item content if <code>_content</code> is not defined.
     * @apiParam {String} [description] A short description about the item, must be defined if <code>_content</code> isn't.
     * @apiPermission ROLE_USER
     * @apiName CreateItem
     * @apiGroup Item
     * @apiSuccess {Item} data The new item.
     */
    .post(isGranted('ROLE_USER'), function(req, res) {
        require('./post')(req, res);
    })
    /**
     * @api {get} /api/items Get multiple items
     * @apiParam {Number} skip=0 Skip x element.
     * @apiParam {Number} limit=20 Limit x element.
     * @apiParam {String} [sort_field] Field used to sort (sort_dir must be defined).
     * @apiParam {Number} [sort_dir] Sort direction (-1, 1) (sort_field must be defined).
     * @apiParam {Boolean} [custom_sort] To sort items as the author sort them.
     * @apiParam {String} [search] Search items with title containing the search param.
     * @apiParam {String} [_collection] To get items that belongs to the collection with <code>_collection</code> as id.
     * @apiPermission none
     * @apiName GetItems
     * @apiGroup Item
     * @apiSuccess {Item[]} data Array of item.
     */
    .get(function(req, res){
        require('./getMultiple')(req, res);
    });

router.route('/:item_id')
    .get(function(req, res){
       //require('./getOne')(req, res);
    })
    /**
     * @api {put} /api/items/:item_id Update an item
     * @apiParam {String} item_id Item unique ID.
     * @apiParam {String} [title] Title of the item.
     * @apiParam {Boolean} [updatePosition] Set it to true if you plan to update the position.
     * @apiParam {Number} [position] To update the position (updatePosition must be defined).
     * @apiParam {String} [description] A short description about the item.
     * @apiParam {Object} [type] An object that contain the type id.
     * @apiParam {ItemContent} [_content] A new item content.
     * @apiPermission ROLE_USER
     * @apiName PutUpdateItem
     * @apiGroup Item
     * @apiSuccess {Item} data An item updated.
     * @apiDescription You must be the author of the item or be granted admin to do this.
     */
    .put(isGranted('ROLE_USER'), function(req, res) {
        require('./put')(req, res);
    })
    /**
     * @api {delete} /api/items/:item_id Delete an item
     * @apiParam {String} item_id Item unique ID.
     * @apiPermission ROLE_USER
     * @apiName DeleteItem
     * @apiGroup Item
     * @apiDescription You must be the author of the item or be granted admin to do this.
     */
    .delete(isGranted('ROLE_USER'), function(req, res) {
        require('./delete')(req, res);
    });


module.exports = router;
