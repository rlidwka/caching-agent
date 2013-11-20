
https://github.com/isaacs/npm/issues/4159

# Usage

See `test.js` for an example.

```javascript
var Agent = require('caching-agent').Agent

var agent = new Agent({
	// here you can specify a few arguments passed to http.Agent

	// cache setup
	cache: {
		// path to filesystem cache
		path: '/path/to/cache'

		// maximum age of objects in cache
		maxage: '10h',

		// maximum size of objects in cache
		maxsize: '1G',

		// nginx-like stuff, i.e.
		// /path/to/cache/c/29/b7f54b2df7773722d382f4809d65029c
		levels: '1:2',
	}
})
```

# Existing stuff

http caches:

https://github.com/d11wtq/node-http-cache - cache server, but still useful
https://github.com/matteoagosti/node-request-caching - client-side cache, but not rfc compliant

fs cache managers:

https://github.com/isaacs/node-lru-cache - in-memory cache, maybe can be rewritten
https://github.com/BryanDonovan/node-cache-manager - ?

more filesystem storages?

# Open questions

1. request don't support custom agents
2. shall we override response (high-level, parsed headers) or socket (very low-level)?

# TODO

There are effectively two modules here:

- http cache support
- managing of filesystem objects

Split them?

