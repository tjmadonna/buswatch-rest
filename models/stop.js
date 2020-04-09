const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  routes: {
    type: [String],
    required: true,
    default: []
  },
}, { _id: false })

module.exports = mongoose.model('Stop', schema)