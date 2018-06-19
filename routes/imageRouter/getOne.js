module.exports = function getOne (req, res) {
  let request = require('request')

  if (req.query && req.query.url) {
    let stream = request.get(req.query.url)
    stream.on('error', function (e) {
      // res.status(400).json({error: "Bad url params"});
    })

    stream.pipe(res).on('error', function (e) {
      res.status(400).json({error: 'Bad url params'})
    })
  } else {
    res.sendStatus(400)
  }
}
