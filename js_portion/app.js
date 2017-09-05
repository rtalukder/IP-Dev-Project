var express = require('express'),
	app = express();

app.get('/', function(req, res){
	app.use(express.static(__dirname + '/public'))
	res.sendFile('index.html', {'root': __dirname + '/public/index'});
});

app.listen(3000)