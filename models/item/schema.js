module.exports = function getItemSchema (Schema) {
  let itemTypes = require('./itemTypes.json')
  let lifeStates = require('../lifeStates.json')
  let itemDisplayModes = require('./displayModes.json')

  return new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    lifeState: {
      type: String,
      required: true,
      default: lifeStates.ACTIVE.id
    },
    displayMode: {
      type: String,
      required: true,
      default: itemDisplayModes.SMALL.id
    },
    title: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return (v.length <= 500)
        },
        message: '{VALUE} is not a title'
      }
    },
    host: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return (v.length <= 500)
        },
        message: '{VALUE} is not a host'
      }
    },
    description: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return (v.length <= 10000)
        },
        message: '{VALUE} is not a description'
      }
    },
    type: {
      type: String,
      required: true,
      default: itemTypes.URL.id
    },
    position: {type: Number},

    // Relations
    _author: { type: String, ref: 'User' },
    _content: {
      type: Schema.Types.Mixed,
      required: false
    },
    _collection: { type: String, ref: 'Collection' }
  })
}
