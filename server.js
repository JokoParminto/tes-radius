const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const request = require('request').defaults({ encoding: null });
dotenv.config({
  path: './config.env'
});

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!!! shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log(database)

// Connect the database
mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.DATABASE_USERNAME, // IMPORTANT TO HAVE IT HERE AND NOT IN CONNECTION STRING
  pass: process.env.DATABASE_PASSWORD, // IMPORTANT TO HAVE IT HERE AND NOT IN CONNECTION STRING
  dbName: process.env.DATABASE_NAME,
}).then(con => {
  console.log('DB connection Successfully!');
});

// Start the server
const port = process.env.PORT;
console.log(port)
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!!!  shutting down ...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});