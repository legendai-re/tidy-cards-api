var deleteOne = require('./deleteOne');
var getOne = require('./getOne');

function init(itemController){
    deleteOne.init(itemController);    
}

module.exports = {
    init: init,
    deleteOne: deleteOne.deleteOne,
    getOne: getOne
}
