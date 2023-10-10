const mongoose = require('mongoose')

const arrowSchema = new mongoose.Schema({
  arrowNumber: { type: Number, required: true, min: 1 },
  arrowScore: { type: Number, min: 0, max: 10 },
  isX: { type: Boolean, required: true, default: false }
})

const scoreSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  totalScore: { type: Number, required: true, default: 0 },
  scored10s: { type: Number, required: true, default: 0 },
  scoredXs: { type: Number, required: true, default: 0 },
  handicap: { type: Number, required: true, default: 150 },
  location: { type: String },
  weather: { type: String },
  notes: { type: String },
  roundType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoundType'
  },
  bowType: {
    type: String,
    required: true,
    enum: ['Compound', 'Recurve', 'Barebow', 'Traditional'],
    message: 'Bow type must be either Compound, Recurve, Barebow, or Traditional'
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  archerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArcherProfile'
  },
  scoreType: {
    type: String,
    required: true,
    enum: ['Practice', 'League', 'Head to Head', 'Competition'],
    message: 'Round type must be either Practice, League, Head to Head or Competition'
  },
  completed: { type: Boolean, required: true, default: false },
  visible: { type: Boolean, required: true, default: true },
  arrowValues: [arrowSchema]
},
{ timestamps: true })

module.exports = mongoose.model('Score', scoreSchema)
