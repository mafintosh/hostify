var http = require('http');

http.createServer(function(request, response) {
	response.writeHead(200);
	response.end('helloish\n');
}).listen('/tmp/hostify/local.kkloud.com.sock');

http.createServer(function(request, response) {
	response.writeHead(200);
	response.end('hello from '+request.headers.host+'\n');
}).listen('/tmp/hostify/*.local.kkloud.com.sock');