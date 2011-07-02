# Hostify
Hostify is a small program written with [node.js](http://nodejs.org) that allows for multiple servers to listen on the same port based on their hostname.
First run hostify:

	./hostify

This creates a server on port `80` which forwards requests to unix sockets listening in `/tmp/hostify` based on the `Host` header in the `http` request.

```js
// hostify will forward all requests to example.com to this server
require('http').createServer(function(request, response) {
	response.writeHead(200);
	response.end('hello world');
}).listen('/tmp/hostify/example.com.sock'); 
```

You can also use dns wildcards

```js
// hostify will forward all requests to *.example.com to this server (fx foo.example.com)
require('http').createServer(function(request, response) {
	response.writeHead(200);
	response.end('hello world');
}).listen('/tmp/hostify/*.example.com.sock'); 
```

To listen in another folder than `/tmp/hostify` or a different port use the options `--sockets` and `--port`