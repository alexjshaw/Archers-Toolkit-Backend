const mongoose = require('mongoose')

const arrowValueSchema = new mongoose.Schema({
  arrowNumber: { type: Number, required: true },
  arrowValue: { type: Number, required: true, min: 1, max: 10 },
  isX: { type: Boolean, required: true, default: false }
})

const endSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  endNumber: { type: Number, required: true },
  endTotal: { type: Number, required: true, default: 0 },
  end10s: { type: Number, required: true, default: 0 },
  endXs: { type: Number, required: true, default: 0 },
  score: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Score'
  },
  arrowValues: [arrowValueSchema]
},
{ timestamps: true })

module.exports = mongoose.model('End', endSchema)
