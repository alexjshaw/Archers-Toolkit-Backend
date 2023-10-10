const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  profile: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    bio: { type: String },
    club: { type: String }
  },
  archerProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ArcherProfile' }],
  equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }]
},
{ timestamps: true })

module.exports = mongoose.model('User', userSchema)
