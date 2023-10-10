const mongoose = require('mongoose')

const handicapSchema = new mongoose.Schema({
  Handicap: {
    type: Number,
    required: true
  },
  roundTypes: {
    type: Map,
    of: Number,
    required: true
  }
})

module.exports = mongoose.model('Handicap', handicapSchema)
