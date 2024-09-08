require('dotenv').config();

module.exports = {
  ipstackApiKey: process.env.IPSTACK_API_KEY,
  ipapiApiKey: process.env.IPAPI_API_KEY,
  rateLimit: 2  // Global rate limit per vendor per hour
};
