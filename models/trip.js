const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  trip_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Trip', schema)