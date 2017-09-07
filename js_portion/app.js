var express = require('express'),
	path = require('path'),
	request = require('request'),
	bodyParser = require('body-parser'),
	app = express();

app.use(express.static(__dirname + "/public"));

app.set('views', path.join(__dirname + '/public/signup'));
app.set('view engine', 'ejs');

app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(bodyParser.urlencoded({extended: true}));

// index.html
app.get('/', function(req, res){
	res.sendFile('index.html', {'root': __dirname + '/public/index'});
});

// signin.html
app.get('/signin', function(req, res){
	res.sendFile('signin.html', {'root': __dirname + '/public/signin'});
});

// signup.html
app.get('/signup', function(req, res){
	res.render('signup', {error:'','root':__dirname + '/public/signup'});
});

app.post('/register', function(req, resp){
	var _firstname 	= req.body.inputFirstName;
	var _lastname 	= req.body.inputLastName;
	var _username	= req.body.inputUsername;
	var _password	= req.body.inputPassword;
	var _phone		= req.body.inputPhone;
/*	var _role		= req.body.role;
	var _location	= req.body.location;*/

	var options = {
	url : 'http://127.0.0.1:5000/user/',
	method: 'POST',
	auth: {
		user: 'admin',
		password: 'password'
	},

	formData: {
		firstname: 	_firstname,
		lastname: 	_lastname,
		username: 	_username,
		password: 	_password,
		phone: 		_phone
/*		role: 		_role,
		location: 	_location,*/
	}
}

	request(options, function(err, res, body) {
	        if (err) {
	            return resp.render('signup', {
	                error: err
	            })
	        }
	        var result = JSON.parse(body)
	        if (result._status == 'ERR') {
	            if (result._error.code == '400') {
	                return resp.render('signup', {
	                    error: 'Username Already Exists!'
	                })
	            }
	            return resp.render('signup', {error: result._issues})
	        } else {
	            console.log('All good');
	            resp.redirect('http://localhost:3000/#/signin');
	        }
	    })
});

app.listen(3000)