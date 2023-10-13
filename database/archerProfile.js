const ArcherProfileModel = require('../models/archerProfileModel.js')
const UserModel = require('../models/userModel.js')

class ArcherProfile {
  static async createArcherProfile (userId, query = {}) {
    try {
      const newArcherProfile = new ArcherProfileModel(query)
      await newArcherProfile.save()

      const user = await UserModel.findById(userId)
      if (!user) {
        throw new Error('No User Found')
      }

      user.archerProfiles.push(newArcherProfile._id)
      await user.save()

      return newArcherProfile
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getCurrentArcherProfiles (userId) {
    try {
      const archerProfiles = await ArcherProfileModel.find({ user: userId }).exec()
      if (!archerProfiles || archerProfiles.length === 0) {
        return { success: false, message: 'No ArcherProfiles found' }
      }
      return archerProfiles
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async searchArcherProfiles (query = {}) {
    try {
      const archerProfiles = await ArcherProfileModel.find(query).exec()

      if (!archerProfiles || archerProfiles.length === 0) {
        throw new Error('No ArcherProfiles found')
      }
      return archerProfiles
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteArcherProfile (mongoId, archerProfileId) {
    try {
      const archerProfile = await ArcherProfileModel.findById(archerProfileId)
      if (archerProfile.createdBy !== mongoId.toString()) {
        throw new Error('Users may only delete their own Archer Profiles')
      }

      const deletedArcherProfile = await ArcherProfileModel.findByIdAndDelete(archerProfileId)

      if (!deletedArcherProfile) {
        throw new Error('No ArcherProfile found')
      }

      const userId = deletedArcherProfile.user
      const user = await UserModel.findById(userId)
      if (user) {
        const index = user.archerProfiles.indexOf(archerProfileId)
        if (index > -1) {
          user.archerProfiles.splice(index, 1)
          await user.save()
        }
      }

      return deletedArcherProfile
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateArcherProfile (archerProfileId, userId, update) {
    try {
      const updatedArcherProfile = await ArcherProfileModel.findOneAndUpdate(
        { _id: archerProfileId, createdBy: userId.toString() },
        { $set: update },
        { new: true, runValidators: true }
      )
      if (!updatedArcherProfile) {
        throw new Error('No ArcherProfile Found or ArcherProfile does not belong to current user')
      }

      return updatedArcherProfile
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = { ArcherProfile }