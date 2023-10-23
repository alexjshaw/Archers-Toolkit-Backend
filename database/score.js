var ScoreModel = require('../models/scoreModel.js')
var ArcherProfileModel = require('../models/archerProfileModel.js')
var EquipmentModel = require('../models/equipmentModel.js')
var RoundTypeModel = require('../models/roundTypeModel.js')
// var mongoose = require('mongoose')

class Score {
  static async validateOwnership (userId, archerProfileId, equipmentId) {

    try {
      const archerProfile = await ArcherProfileModel.findById(archerProfileId).select('user')
      const equipment = await EquipmentModel.findById(equipmentId).select('user')

      if (!archerProfile || !equipment) {
        return false
      }

      return archerProfile.user.toString() === userId.toString() && equipment.user.toString() === userId.toString()
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async createScore (userId, query = {}) {
    try {
      const roundType = await RoundTypeModel.findById(query.roundType)
      const equipment = await EquipmentModel.findById(query.equipment)
      const archerProfile = await ArcherProfileModel.findById(query.archerProfile)

      if (!roundType) {
        throw new Error('Invalid round selected')
      }

      const newScore = new ScoreModel(query)
      await newScore.save()
      roundType.scores.push(newScore._id)
      equipment.scores.push(newScore._id)
      archerProfile.scoreData.scores.push(newScore._id)
      await roundType.save()
      await equipment.save()
      await archerProfile.save()
      return newScore
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateScore (userId, scoreId, update) {
    try {
      const updatedScore = await ScoreModel.findOneAndUpdate(
        { _id: scoreId },
        { $set: update },
        { new: true }
      )

      if (update.equipment) {
        const equipment = await EquipmentModel.findById(update.equipment).select('user')

        if (equipment.user.toString() !== userId.toString()) {
          throw new Error('Equipment does not belong to current user')
        }
      }

      if (!updatedScore) {
        throw new Error('No score found')
      }

      if (updatedScore.createdBy !== userId) {
        throw new Error('User may only update their own scores')
      }

      return updatedScore
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteScore(userId, scoreId) {
    try {
      const score = await ScoreModel.findOne({
        _id: scoreId,
        createdBy: userId
      });
  
      if (!score) {
        throw new Error('Score not found');
      }
  
      if (score.completed === true) {
        const result = await ScoreModel.findByIdAndUpdate(scoreId, { $set: { visible: false } });
        return result;
      } else {
        const result = await ScoreModel.findByIdAndDelete(scoreId);
        return result;
      }
  
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findMany (query = {}) {
    try {
      const scores = await ScoreModel.find(query)
      return scores
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = { Score }