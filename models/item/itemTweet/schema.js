module.exports = function getItemTweetSchema (Schema) {
  return new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    url: {
      type: String,
      required: false
    },
    author_name: {
      type: String,
      required: false
    },
    author_url: {
      type: String,
      required: false
    },
    html: {
      type: String,
      required: false
    },
    width: {
      type: Number,
      required: false
    },
    height: {
      type: Number,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    cache_age: {
      type: String,
      required: false
    },
    provider_name: {
      type: String,
      required: false
    },
    provider_url: {
      type: String,
      required: false
    },
    version: {
      type: String,
      required: false
    },
    _user: { type: String, ref: 'User' }
  })
}
