const config = require('./config');

module.exports = {
  ipstack: {
    url: (ip) => `http://api.ipstack.com/${ip}?access_key=${config.ipstackApiKey}`,
    name: "ipstack"
  },
  ipapi: {
    url: (ip) => `http://api.ipapi.com/api/${ip}?access_key=${config.ipapiApiKey}`,
    name: "ipapi"
  }
};
