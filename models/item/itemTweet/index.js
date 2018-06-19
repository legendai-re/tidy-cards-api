let mongoose = require('mongoose')
let Schema = mongoose.Schema

let ItemTweetSchema = require('./schema')(Schema)

ItemTweetSchema.pre('save', function (next) {
  if (!this.createdAt) { this.createdAt = new Date() }
  this.updatedAt = Date()
  next()
})

ItemTweet = mongoose.model('ItemTweet', ItemTweetSchema)

exports.itemTweetModel = ItemTweet
