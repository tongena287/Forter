const express = require('express');
const axios = require('axios');
const cache = require('./cache');
const rateLimit = require('./rateLimit');
const vendors = require('./vendors');

const app = express();
app.use(express.json());

const PORT = 3000;

// Function to get country details from vendor
const getCountryFromVendor = async (ip, vendor) => {
  try {
    const response = await axios.get(vendor.url(ip));
    return response.data.country_name || null;
  } catch (error) {
    throw new Error(`Vendor ${vendor.name} failed: ${error.message}`);
  }
};

// Endpoint: Get Country by IP
app.post('/get-country', async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required." });
  }

  // Check cache first
  if (cache.has(ip)) {
    console.log(`in cache: ${cache.get(ip)}`)
    return res.json({ country: cache.get(ip), fromCache: true });
  }
  console.log(`not in cache`)

  let country = null;

  // Iterate through vendors and use them based on rate limits
  for (const vendor of Object.values(vendors)) {
    console.log(`Vendor: ${Object.values(vendor)}`)
    if (rateLimit.checkRateLimit(vendor.name)) {
      try {
        country = await getCountryFromVendor(ip, vendor);
        rateLimit.incrementRateLimit(vendor.name);

        if (country) {
          cache.set(ip, country);  // Cache the result
          return res.json({ country, vendor: vendor.name });
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  return res.status(429).json({ error: "Rate limit exceeded or all vendors failed." });
});

// Export the app for testing and for starting the server in other files
module.exports = app;

// If you still want to start the server, add this check
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
