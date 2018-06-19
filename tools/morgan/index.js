module.exports = function (app) {
  let fs = require('fs')
  let morgan = require('morgan')
  let path = require('path')
  let rfs = require('rotating-file-stream')
  let aws = require('aws-sdk')

  aws.config.region = 'eu-west-1'

  let s3 = new aws.S3({params: {Bucket: process.env.S3_BUCKET}})

  let logDirectory = path.join(__dirname, '../../logs')

  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

  let accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
  })

  /* if env = production, send log file to aws S3 after daily rotation */
  accessLogStream.on('rotated', function (filename) {
    if (process.env.NODE_ENV !== 'production') { return }

    let folderNames = filename.split('\\')
    let file = folderNames[folderNames.length - 1]
    fs.readFile(filename, function (err, data) {
      if (err) return console.log(err)
      let base64data = new Buffer(data, 'binary')
      let params = {Bucket: process.env.S3_BUCKET, Key: process.env.IMAGES_FOLDER + '/logs/' + file, Body: base64data}
      s3.putObject(params, function (err, data) {
        if (err) {
          console.log(err)
        } else {
          fs.unlink(filename, function (err) {
            if (err) { console.log(err) }
          })
        }
      })
    })
  })

  let errorLogFile = fs.createWriteStream('node.error.log', { flags: 'a' })

  app.use(morgan('combined', {stream: accessLogStream}))
}
