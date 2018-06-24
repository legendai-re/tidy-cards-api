module.exports = function getCollectionSchema (Schema) {
  let visibility = require('./visibility.json')
  let displayMode = require('./displayMode.json')
  let lifeStates = require('../lifeStates.json')

  return new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    lifeState: {
      type: String,
      required: true,
      default: lifeStates.ACTIVE.id
    },
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return (v.length <= 100)
        },
        message: '{VALUE} is not a title'
      }
    },
    bio: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return (v.length <= 1000)
        },
        message: '{VALUE} is not a bio'
      }
    },
    color: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return new RegExp('^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(v)
        },
        message: '{VALUE} is not a valid color'
      }
    },
    displayMode: {
      type: String,
      default: displayMode.LIST.id
    },
    depth: {
      type: Number,
      required: true
    },
    visibility: {
      type: String,
      default: visibility.PRIVATE.id
    },
    itemsCount: {
      type: Number,
      default: 0
    },
    collaboratorsCount: {
      type: Number,
      default: 0
    },
    starsCount: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    featuredAt: { type: Date },
    isOnDiscover: {
      type: Boolean,
      default: false
    },

    // Values never saved, only used for frondend, defined after find()
    position: {type: Number},
    _star: { type: String, ref: 'Star' },
    _parents: [{ type: String, ref: 'Collection' }],

    // Relations
    _rootCollection: { type: String, ref: 'Collection' },
    _parent: { type: String, ref: 'Collection' },
    _author: { type: String, ref: 'User' },
    _collaborators: [{ type: String, ref: 'User' }],
    _thumbnail: { type: String, ref: 'Image' }
  }, {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  })
}
