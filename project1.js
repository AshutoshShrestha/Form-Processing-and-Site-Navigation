var connect = require("connect");
var logger = require("morgan");
var serve_static = require("serve-static");
var http = require("http");
var url = require('url');  
var ejs = require('ejs');  

var contactList = []; //array to store contacts

var app = connect()
  .use(logger('dev'))
  .use(serve_static('public'))
  .use(serve)

http.createServer(app).listen(3000);

function serve (req, res) {
	console.log("Host name:  " + req.headers.host);
	console.log("Connection:  " + req.headers.connection);
	console.log("Accept:  " + req.headers.accept);
	
	if(req.url == '/project1.html' && req.method == 'POST')  {
		process_post(req, res);
	}
	else if(req.url == '/contact-lists.html'){
		process_contactList(req, res);
	}
	else{
		res.writeHead(401, {'Content-Type': 'text/html'});
        res.end("Not found!");
	}
}

function process_post(req, res) {
	var body = "";
	req.on('data', function (chunk) {
	   	body += chunk;
	});
	req.on('end', function() {
		qs = require('querystring');
        var post =  qs.parse(body);
        contactList.push(post);
        ejs.renderFile("formResult.ejs",{"post": post},
            function(err, result) {
                if (!err) {
                    res.end(result);
                }
                else {
                    res.end("An error occurred");
                }
            }
        );
    });
}

function process_contactList(req, res) {
	ejs.renderFile("contactList.ejs", {"contactList": contactList},
		function(err,result){
			if(!err){
				res.end(result);
			}
			else{
				res.end("An error occured.");
			}
		});
}