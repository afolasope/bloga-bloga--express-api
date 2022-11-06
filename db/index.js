const mongoose = require('mongoose');
require('dotenv').config();

MONGODB_CONNECTION_URL = process.env.MONGODB_URL;
PORT = process.env.PORT;

function connectToMongoDB() {
  mongoose.connect(MONGODB_CONNECTION_URL);

  mongoose.connection.on('connected', () => {
    console.log('connection successful');
  });
  mongoose.connection.on('error', (error) => {
    console.log('connection failed');
    console.log(error);
  });
}

module.exports = { connectToMongoDB };

