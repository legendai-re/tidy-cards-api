module.exports = function getLogs (req, res) {
  let fs = require('fs')
  let path = require('path')

  let filePath = path.join(__dirname, '../../logs/' + req.params.filename + '.log')
  let logs = fs.statSync(filePath)

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': logs.size
  })

  let readStream = fs.createReadStream(filePath)

  readStream.pipe(res)
}
