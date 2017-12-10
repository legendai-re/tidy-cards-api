var algoliasearch = require('algoliasearch');
var algoliaClient = algoliasearch(process.env.ALGOLIA_API_KEY, process.env.ALGOLIA_API_SECRET);

module.exports = algoliaClient;