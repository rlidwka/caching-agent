var fs = require('fs') // graceful-fs maybe?
var crypto = require('crypto')

function Cache(options) {
	this.path = options.path

	// making cache path, ignoring errors
	fs.mkdir(options.path, function(){})
}

// return a path to cache file uniquely defined by object
// postfix is for collision handling later on
Cache.prototype._get_path = function(object, postfix) {
	var hash = crypto
	             .createHash('ripemd')
	             .update( JSON.stringify(object) + postfix )
	             .digest('hex')

	return this.path + '/' + hash
}

// get something from the cache
// in the future this will compare first bytes to object first,
// and open another file if it doesn't match
Cache.prototype.get = function(object) {
	return fs.createReadStream(this._get_path(object))
}

// push something to the cache
Cache.prototype.set = function(object) {
	return fs.createWriteStream(this._get_path(object))
}

module.exports = Cache

