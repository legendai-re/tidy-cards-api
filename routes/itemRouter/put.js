module.exports = function put (req, res) {

    let itemTypes       = require('../../models/item/itemTypes.json');
    let itemDisplayModes = require('../../models/item/displayModes.json');
    let sortTypes       = require('../../models/customSort/sortTypes.json');
    let models          = require('../../models');
    let itemContentController = require('../../controllers/itemController/itemContentController');

    models.Item.findById(req.params.item_id).populate('_collection').exec(function(err, item){
        if(err) {console.log(err); res.sendStatus(500); return;}
        if(!item) {res.status(404).send({ error: "cannot find item with id: "+req.params.item_id }); return;}
        if(item._collection._author!=req.user._id) {res.status(401).send({ error: "only the author of the collection can update item" }); return;}

        if(req.body.updatePosition && typeof req.body.position != 'undefined'){
            updatePosition(item, req.body.position)
        }else{

            // if a specific displayMode is defined and is OK, update the item
            if(req.body.displayMode && displayModeOk(req.body.displayMode))
                item.displayMode = req.body.displayMode;

            if(req.body.description || req.body.description == '')
                item.description = req.body.description;
            
            if(req.body.title)
                item.title = req.body.title;

            if(!typeOk(req.body.type))
                return res.status(400).send({ error: 'bad item type'});

            item.type = req.body.type;
            itemContentController.checkItemContent(req.user, req.body.type, req.body._content, function(err, content){
                if (err){res.status(400).send({ error: err}); return;}
                if(!content && !item.description){res.status(400).send({ error: "you must add a description if there is no url"}); return;}
                if(content)
                    item._content = content._id;
                item.save(function(err){
                    if(err) {console.log(err); res.sendStatus(500); return;}
                    sendResponse(item);
                });
            });
        }
    });

    function typeOk(reqType){
        return itemTypes[reqType] !== null;
    }

    function displayModeOk(reqDisplayMode){
        return itemDisplayModes[reqDisplayMode] !== null;
    }

    function updatePosition(item, newPosition){
        models.CustomSort.findOne({ _collection: item._collection._id, type: sortTypes.COLLECTION_ITEMS.id}, function(err, customSort){
            if (err) {console.log(err); res.sendStatus(500); return;}
            //remove id of item
            models.CustomSort.update({ _id: customSort._id},{ $pull: { ids: item._id } }, function(err, result){
                if (err) {console.log(err); res.sendStatus(500); return;}
                //add id at the new position
                models.CustomSort.update({_id: customSort._id}, { $push: { ids: { $each: [ item._id ], $position: newPosition } } }, function(err, result){
                    if (err) {console.log(err); res.sendStatus(500); return;}
                    sendResponse(item);
                });
            })
        })
    }

    function sendResponse(item){
        res.json({data: item});
    }
}
