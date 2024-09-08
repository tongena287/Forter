const NodeCache = require('node-cache');

// Initialize cache with a TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

module.exports = {
  get: (key) => cache.get(key),
  set: (key, value) => cache.set(key, value),
  has: (key) => cache.has(key),
  flushAll: () => cache.flushAll()
};
