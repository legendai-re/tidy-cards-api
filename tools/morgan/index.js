module.exports = function(app) {

	var fs = require('fs');
	var morgan = require('morgan');
	var path = require('path');
	var rfs = require('rotating-file-stream');
	var aws = require('aws-sdk')

	aws.config.region = 'eu-west-1';

	var s3 = new aws.S3({params: {Bucket: process.env.S3_BUCKET}});

	var logDirectory = path.join(__dirname, '../../logs');
 
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	var accessLogStream = rfs('access.log', {
	  interval: '1d',
	  path: logDirectory
	})
	
	/* if env = production, send log file to aws S3 after daily rotation */
	accessLogStream.on('rotated', function(filename) {
		if(process.env.NODE_ENV != 'production')
			return;

    	var folderNames = filename.split('\\');
    	var file = folderNames[folderNames.length-1];
    	fs.readFile(filename, function(err, data) {
	        if(err) return console.log(err);
	        var base64data = new Buffer(data, 'binary');
            var params = {Bucket: process.env.S3_BUCKET, Key: process.env.IMAGES_FOLDER+'/logs/'+file, Body: base64data};
            s3.putObject(params, function(err, data) {
                if(err){
                    console.log(err);
                }else{
                    fs.unlink(filename, function(err){
                    	if(err)
                    		console.log(err);
                    });
                }
            });
	    });
	});

	var errorLogFile = fs.createWriteStream('node.error.log', { flags: 'a' });

	app.use(morgan('combined', {stream: accessLogStream}));

} 