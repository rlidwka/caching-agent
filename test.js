var Agent = require('./').Agent

var agent = new Agent({
	cache: {
		path: './cache',
	}
})

var http = require('http')

http.createServer(function(req, res) {
	res.writeHead(200)
	res.write(String(Math.random()))
	res.end()
}).listen(31337)

function request(cb) {
	http.request({
		host: '127.0.0.1',
		port: 31337,
		path: '/whatever',
		agent: agent,
	}, function(res) {
		res.setEncoding('utf8')
		res.on('data', console.log)
		res.on('end', cb)
	}).end()
}

request(function() {
	request(function() {
		process.exit()
	})
})
