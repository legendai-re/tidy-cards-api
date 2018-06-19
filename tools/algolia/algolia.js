let algoliasearch = require('algoliasearch')
let algoliaClient = algoliasearch(process.env.ALGOLIA_API_KEY, process.env.ALGOLIA_API_SECRET)

module.exports = algoliaClient
