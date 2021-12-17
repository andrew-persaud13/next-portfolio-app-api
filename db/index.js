const mongoose = require('mongoose');
const config = require('../config');

//register models
require('./models/portfolio');
require('./models/blog');

exports.connectDB = () => {
  mongoose.connect(
    config.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    err => {
      if (err) console.log(err);
      console.log('mongoooo');
    }
  );
};
