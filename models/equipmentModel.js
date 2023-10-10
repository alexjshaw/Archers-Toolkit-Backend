const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  bowType: {
    type: String,
    required: true,
    enum: ['Compound', 'Recurve', 'Barebow', 'Traditional'],
    message: 'Bow type must be either Compound, Recurve, Barebow, or Traditional'
  },
  equipmentName: { type: String, required: true },
  bowName: { type: String },
  arrowName: { type: String },
  equipmentNotes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sightmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sightmark' }],
  scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }]
},
{ timestamps: true })

module.exports = mongoose.model('Equipment', equipmentSchema)
