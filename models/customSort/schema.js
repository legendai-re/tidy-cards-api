module.exports = function getCustomSortSchema (Schema) {
  return new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    ids: {
      type: Array,
      default: []
    },
    type: {
      type: String,
      required: true
    },
    _user: { type: String, ref: 'User' },
    _collection: { type: String, ref: 'Collection' }
  })
}
