var fs = require('fs');
var net = require('net');
var common = require('common');

var noop = function() {};
var dir = '/tmp/hostify/';
var socks = {};

try {
	fs.mkdirSync(dir, 0700);
} catch(err) {}

var updateSocks = function() {
	fs.readdir(dir, common.fork(noop, function(files) {
		var tmp = {};
		var invalid = /([\.\+\(\)\[\]\{\}\/\\\?])/g;
		
		var files = files.filter(function(file) {
			return /\.sock$/i.test(file);
		});
				
		files.forEach(function(sock) {
			tmp[sock] = socks[sock] || new RegExp('^'+sock.replace(/\.sock$/i, '').replace(invalid, '\\$1').replace(/(^|\.)\*\\\./g, '$1[^.]+\\.')+'$', 'i');
		});
		
		socks = tmp;
	}));
};

updateSocks();

fs.watchFile(dir, updateSocks);

var server = net.createServer(function(socket) {
	var buffers = [];
	
	var pipe = function(proxy) {
		socket.pause();		
		socket.removeListener('data', ondata);
		
		proxy.on('connect', function() {
			socket.resume();
			
			while (buffers.length) {
				proxy.write(buffers.shift());
			}
			if (!socket.readable) {
				proxy.end();
				return;
			}
			
			socket.pipe(proxy);
			proxy.pipe(socket);
		});
	};
	var ondata = function(data) {
		buffers.push(data);
		
		var match = buffers.join('').match(/\r\nhost: ([^:]+)(:\d+)?\r\n/i);
		
		if (!match) {
			return;
		}
		for (var sock in socks) {
			if (socks[sock].test(match[1])) {
				pipe(net.createConnection(dir+sock));
				return;
			}
		}
		socket.end('HTTP/1.1 404 Not Found\r\n\r\n');
	};
	
	socket.on('data', ondata);
});

server.listen(9999);