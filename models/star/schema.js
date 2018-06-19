module.exports = function getStarSchema (Schema) {
  return new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _user: { type: String, ref: 'User' },
    _collection: { type: String, ref: 'Collection' }
  })
}
