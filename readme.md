# IP to Country API

## Prerequisites

1. Install [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm).
2. Run `nvm use 20`. This should return a message like:  
   Now using node v20.5.0 (npm v10.3.0)

markdown
Copy code

- Node version: 20.5.0
- NPM version: 10.3.0

## Setup

1. Install dependencies by running:

```bash
npm install
Testing
Tests are located in the __tests__ folder.
To run the tests, use the command:
bash
Copy code
npm test
Running the App
The application runs on port 3000.
The main endpoint is a POST request to /get-country.
Manual Tests
Use Postman or curl to test the following scenarios:

a. Use a valid IP address:

json
Copy code
{
  "ip": "210.138.184.59"
}
Expected Result: Japan

b. Use another valid IP address:

json
Copy code
{
  "ip": "1.1.1.21"
}
Expected Result: Australia

c. Use a valid IP again:

json
Copy code
{
  "ip": "21.1.1.21"
}
Expected Result: USA – note that you'll see the vendor change because the rate limit is set to 2

d. Reuse any of the above IP addresses.
Expected Result: Cache will be hit.

e. Use an invalid IP address (letters, numbers greater than 255, etc.).
Expected Result: Invalid IP error.

f. Use one more valid IP address to exceed the total rate limit.
Expected Result: Rate limit reached error.

g. Exceed rate limits to fail.
Expected Result: Rate limit failure.

```
