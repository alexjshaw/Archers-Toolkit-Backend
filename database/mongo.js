const mongoose = require('mongoose')
const userModel = require('../models/userModel.js')
const archerProfileModel = require('../models/archerProfileModel.js')
const equipmentModel = require('../models/equipmentModel.js')
const endModel = require('../models/endModel.js')
const handicapModel = require('../models/handicapModel.js')
const roundTypeModel = require('../models/roundTypeModel.js')
const scoreModel = require('../models/scoreModel.js')
const sightmarkModel = require('../models/sightmarkModel.js')

const mongoDBURL = 'mongodb://127.0.0.1:27017/ArcheryScorecard'

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to local MongoDB instance')

    await userModel.init()
    await archerProfileModel.init()
    await equipmentModel.init()
    await endModel.init()
    await handicapModel.init()
    await roundTypeModel.init()
    await scoreModel.init()
    await sightmarkModel.init()

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('Mongoose disconnected on app termination')
        process.exit(0)
      })
    })
  } catch (err) {
    console.log('Connection Failed')
    console.error(err)
    process.exit(1) // Exit with failure code
  }
}

connectDB()

module.exports = {}
