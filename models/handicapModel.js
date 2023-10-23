const mongoose = require('mongoose')

const handicapSchema = new mongoose.Schema({
  Handicap: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  roundTypes: {
    type: Map,
    of: Number,
    required: true
  }
})

module.exports = mongoose.model('Handicap', handicapSchema)
