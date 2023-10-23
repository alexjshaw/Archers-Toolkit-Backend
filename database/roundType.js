var RoundTypeModel = require('../models/roundTypeModel.js')
var mongoose = require('mongoose')

class RoundType {
  static async createRoundType (query = {}) {
    try {
      const newRoundType = new RoundTypeModel(query)
      await newRoundType.save()
      return newRoundType
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getRoundTypeById (query = {}) {
    try {
      const roundType = await RoundTypeModel.findOne(query)
      return roundType
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async searchRoundType (query = {}) {
    try {
      const roundType = await RoundTypeModel.find(query).exec()

      if (!roundType || roundType.length === 0) {
        throw new Error('No RoundType found')
      }
      return roundType
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async returnRoundTypeNames (query = {}) {
    try {
      const roundType = await RoundTypeModel.find(query).select('_id name')
      if (!roundType || roundType.length === 0) {
        throw new Error('No RoundType found')
      }
      return roundType
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateRoundType (roundTypeId, userId, update) {
    try {
      const roundType = await RoundTypeModel.findOneAndUpdate(
        { _id: roundTypeId, createdBy: userId },
        { $set: update },
        { new: true }
      )
      if (!roundType) {
        throw new Error('No RoundType found or unauthorized')
      }
      return roundType
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateRoundDistance (roundTypeId, userId, updatesArray) {
    try {
      const roundType = await RoundTypeModel.findOne({
        _id: new mongoose.Types.ObjectId(roundTypeId),
        createdBy: userId
      })

      if (!roundType) {
        throw new Error('No RoundType found or unauthorized')
      }

      for (const update of updatesArray) {
        const distance = roundType.distances.id(update.distanceId)
        if (!distance) {
          throw new Error(`Distance with ID ${update.distanceId} not found`)
        }
        Object.assign(distance, update)
      }

      // Recalculate totalDozens, minDistance, and maxDistance
      const distances = roundType.distances
      roundType.totalDozens = distances.reduce((acc, curr) => acc + curr.numDozens, 0)
      roundType.minDistance = Math.min(...distances.map(d => d.distance))
      roundType.maxDistance = Math.max(...distances.map(d => d.distance))

      await roundType.save()
      return roundType
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteRoundType (roundTypeId, userId) {
    try {
      const result = await RoundTypeModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(roundTypeId),
        createdBy: userId
      })
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteRoundDistance (distanceId, userId) {
    try {
      const roundType = await RoundTypeModel.findOne({ 'distances._id': new mongoose.Types.ObjectId(distanceId), createdBy: userId })
      if (!roundType) {
        return null
      }

      // Filter out the distance to be removed
      const updatedDistances = roundType.distances.filter(d => d._id.toString() !== distanceId)

      if (updatedDistances.length === roundType.distances.length) {
        return null // No distance was removed
      }

      // Reassign the filtered distances back to the roundType
      roundType.distances = updatedDistances

      // Recalculate totalDozens, minDistance, and maxDistance
      roundType.totalDozens = updatedDistances.reduce((acc, curr) => acc + curr.numDozens, 0)
      roundType.minDistance = Math.min(...updatedDistances.map(d => d.distance))
      roundType.maxDistance = Math.max(...updatedDistances.map(d => d.distance))

      // Update distanceNum for remaining distances
      updatedDistances.forEach((distance, index) => {
        distance.distanceNum = index + 1
      })

      await roundType.save()
      return roundType
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = { RoundType }