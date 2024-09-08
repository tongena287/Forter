const request = require('supertest');
const app = require('../app'); // Import your Express app for testing
const cache = require('../cache'); // Import the cache for testing
const axios = require('axios');

// Mocking axios to return a mock response for tests
jest.mock('axios');

describe('IP to Country API Gateway', () => {
  // Before each test, clear the cache
  beforeEach(() => {
    cache.flushAll();
  });

  it('should return the country name for a valid IP from the ipstack vendor', async () => {
    // Mock the axios call for ipstack API
    axios.get.mockResolvedValueOnce({ data: { country_name: 'United States' } });

    const res = await request(app).post('/get-country').send({ ip: '8.8.8.8' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.country).toEqual('United States');
    expect(res.body.vendor).toEqual('ipstack');
  });

  it('should return the country name for a valid IP from the ipapi vendor when ipstack fails', async () => {
    // Mock the axios call for ipstack API to fail
    axios.get.mockRejectedValueOnce(new Error('ipstack failed'));

    // Mock the axios call for ipapi API to succeed
    axios.get.mockResolvedValueOnce({ data: { country_name: 'Canada' } });

    const res = await request(app).post('/get-country').send({ ip: '8.8.8.8' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.country).toEqual('Canada');
    expect(res.body.vendor).toEqual('ipapi');
  });

  it('should return an error when both vendors fail', async () => {
    // Mock the axios calls for both vendors to fail
    axios.get.mockRejectedValueOnce(new Error('ipstack failed'));
    axios.get.mockRejectedValueOnce(new Error('ipapi failed'));

    const res = await request(app).post('/get-country').send({ ip: '8.8.8.8' });

    expect(res.statusCode).toEqual(429);
    expect(res.body.error).toEqual('Rate limit exceeded or all vendors failed.');
  });

  it('should return the country name from cache if already cached', async () => {
    // Mock the axios call for ipstack API
    axios.get.mockResolvedValueOnce({ data: { country_name: 'United States' } });

    // First request (cache the response)
    await request(app).post('/get-country').send({ ip: '8.8.8.8' });

    // Now, it should fetch from cache
    const res = await request(app).post('/get-country').send({ ip: '8.8.8.8' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.country).toEqual('United States');
    expect(res.body.fromCache).toEqual(true);
  });

  it('should return 400 if the IP address is missing', async () => {
    const res = await request(app).post('/get-country').send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('IP address is required.');
  });
});
