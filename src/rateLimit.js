const config = require('./config');

const rateLimits = {
  ipstack: { limit: config.rateLimit, count: 0 },
  ipapi: { limit: config.rateLimit, count: 0 }
};

// Check if a vendor's rate limit has been reached
const checkRateLimit = (vendor) => {
  console.log(`Rate limit for ${vendor} is ${rateLimits[vendor].limit}`);
  console.log(`current rate limit count: ${rateLimits[vendor].count}`);
  return rateLimits[vendor].count < rateLimits[vendor].limit;
};

// Increment the count for a vendor
const incrementRateLimit = (vendor) => {
  rateLimits[vendor].count += 1;
};

// Reset rate limits every hour
setInterval(() => {
  for (const vendor in rateLimits) {
    rateLimits[vendor].count = 0;
  }
}, 3600000);

module.exports = {
  checkRateLimit,
  incrementRateLimit
};
