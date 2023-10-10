const mongoose = require('mongoose')

const distanceSchema = new mongoose.Schema({
  distance: { type: Number, required: true, min: 1, max: 100 },
  distanceNum: { type: Number, required: true },
  distanceType: {
    type: String,
    required: true,
    enum: ['Yards', 'Metres'],
    message: 'Distance must be in Yards or Metres'
  },
  numDozens: { type: Number, required: true, min: 1, max: 48 },
  targetSize: { type: Number, required: true, min: 1, max: 200 }
},
{ timestamps: true })

const roundTypeSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
  createdBy: { type: String, required: true },
  totalDozens: { type: Number, required: true, min: 1, max: 48 },
  minDistance: { type: Number, required: true, min: 1, max: 100 },
  maxDistance: { type: Number, required: true, min: 1, max: 100 },
  scoringType: {
    type: String,
    required: true,
    enum: ['5 Zone', '10 Zone'],
    message: 'Scoring must be 5 Zone or 10 Zone'
  },
  type: {
    type: String,
    required: true,
    enum: ['Imperial', 'Metric'],
    message: 'Type must be Imperial or Metric'
  },
  distances: [distanceSchema],
  scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }]
},
{ timestamps: true })

roundTypeSchema.pre('save', function (next) {
  const distances = this.distances.map(distance => distance.distance)
  const isUnique = distances.length === new Set(distances).size

  if (!isUnique) {
    next(new Error('Distance values must be unique within a round type.'))
  } else {
    this.totalDozens = this.distances.reduce((sum, distance) => sum + distance.numDozens, 0)
    next()
  }
})

module.exports = mongoose.model('RoundType', roundTypeSchema)
