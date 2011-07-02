var http = require('http');

/*
	1. run 'hostify --port 8080'
	2. run this example
	3. Goto your browser and open http://localhost:8080/
*/

http.createServer(function(request, response) {
	response.writeHead(200);
	response.end('helloish\n');
}).listen('/tmp/hostify/localhost.sock');