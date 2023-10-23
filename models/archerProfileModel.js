const mongoose = require('mongoose')

const handicapHistorySchema = new mongoose.Schema({
  handicap: { type: Number, required: true, min: 0, max: 150 }
}, { timestamps: true })

const archerProfileSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  handicap: { type: Number, required: true, default: 150 },
  bowType: {
    type: String,
    required: true,
    enum: ['Compound', 'Recurve', 'Barebow', 'Traditional'],
    message: 'Bow type must be either Compound, Recurve, Barebow, or Traditional'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scoreData: {
    scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }],
    handicapScores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }]
  },
  handicapHistory: [handicapHistorySchema]
})

archerProfileSchema.index({ user: 1, bowType: 1 }, { unique: true })

module.exports = mongoose.model('ArcherProfile', archerProfileSchema)
