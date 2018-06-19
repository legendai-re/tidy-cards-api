let models = require('../../models')

module.exports = function setItemsAuthor (req, res) {
  let q = models.Collection.find()

  q.populate({
    path: '_author'
  })

  q.exec(function (err, collections) {
    if (err) console.log(err)
    for (let i in collections) {
      let author = collections[i]._author
      models.Item.find({_collection: collections[i]._id}, function (err, items) {
        if (err) console.log(err)
        for (let x in items) {
          items[x]._author = author
          items[x].save(function (err) {
            if (err) console.log(err)
          })
        }
      })
    }
  })

  res.json({message: 'done'})
}
