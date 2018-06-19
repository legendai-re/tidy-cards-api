let deleteOne = require('./deleteOne')
let getOne = require('./getOne')

function init (itemController) {
  deleteOne.init(itemController)    
}

module.exports = {
  init: init,
  deleteOne: deleteOne.deleteOne,
  getOne: getOne
}
