var http = require('http')
  , util = require('util')
  , Cache = require('./cache')
  , Base = http.Agent

// inherits from http.Agent
function Agent(options) {
	if (!(this instanceof Agent)) return new Agent(options)

	// custom options here, other options are passed to parent as is
	if (options.cache != null) {
		if (options.cache.path == null) {
			throw new Error('request.cache.path is required')
		}

		this.cache = new Cache(options.cache)
	}

	return Base.call(this)
}

util.inherits(Agent, Base)

Agent.prototype.addRequest = function(req, options) {
	var self = this
	// Legacy API: addRequest(req, host, port, path)
	if (typeof options === 'string') {
		options = {
			host: options,
			port: arguments[2],
		}
	}

	// a key that identifies current hash
	// looking for in cache can potentially give multiple results
	var cache_key = {
		host: options.host,
		port: options.port,
		path: req.path,
	}

	var cache = self.cache.get(cache_key)
	cache.on('open', function() {
		// item exists in the cache, piping it
		req.onSocket(cache)

		// legacy stuff
		process.nextTick(function() {
			if (typeof(cache.ondata) === 'function') {
				cache.on('data', function(d) {
					cache.ondata(d, 0, d.length)
				})
			}
		})
	})

	cache.on('error', function(err) {
		// item doesn't exist, making a new call
		Base.prototype.addRequest.call(self, req, options.host, options.port, options.path)
		var cache = self.cache.set(cache_key)
		req.on('socket', function(socket) {
			if (typeof(socket.ondata) === 'function') {
				// legacy stuff
				var _ondata = socket.ondata
				socket.ondata = function(d, start, end) {
					cache.write(d.slice(start, end))
					_ondata.apply(this, arguments)
				}
			} else {
				// v0.11.x
				socket.pipe(cache)
			}
		})
		req.on('response', function(res) {
			res.on('end', function() {
				cache.destroySoon()
			})
		})
	})
}

module.exports = Agent

