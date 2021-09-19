const mongoose = require('mongoose');

const { mongo } = require('./vars');

const options =  {
  keepAlive: 1,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});


exports.connect = () => {
  mongoose
    .connect(mongo.uri, options)
    .then(() => console.log('Connected to Db'))
    .catch((e) => console.log(e));
  return mongoose.connection;
};
