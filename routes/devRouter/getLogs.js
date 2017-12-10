module.exports = function getLogs(req, res) {

    var fs = require('fs');
    var path = require('path');
    
	var filePath = path.join(__dirname, '../../logs/'+req.params.filename+'.log');
    var logs = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': logs.size
    });

    var readStream = fs.createReadStream(filePath);
    
    readStream.pipe(res);

}