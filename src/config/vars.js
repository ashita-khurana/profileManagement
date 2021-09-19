const path = require('path');

// import .env variables
require('dotenv-safe').config();

module.exports = {
  port: process.env.PORT,
  mongo: {
    uri : process.env.MONGO_URI
  },
  jwtSecretKey : process.env.TOKEN_KEY
};
