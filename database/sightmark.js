var SightmarkModel = require('../models/sightmarkModel.js')
var EquipmentModel = require('../models/equipmentModel.js')

class Sightmark {
  static async createSightmark (equipmentId, query = {}) {
    try {
      const equipment = await EquipmentModel.findById(equipmentId)

      if (!equipment) {
        throw new Error('No Equipment found with the given ID')
      }

      const newSightmark = new SightmarkModel(query)
      await newSightmark.save()

      equipment.sightmarks.push(newSightmark._id)
      await equipment.save()

      return newSightmark
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateSightmark (sightmarkId, userId, update) {
    try {
      const updatedSightmark = await SightmarkModel.findOneAndUpdate(
        { _id: sightmarkId, createdBy: userId.toString() },
        { $set: update },
        { new: true, runValidators: true }
      )
      if (!updatedSightmark) {
        throw new Error('No Sightmark Belonging to Current User Found')
      }

      return updatedSightmark
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getSightmarks (query = {}) {
    try {
      const sightmark = await SightmarkModel.find(query).exec()

      if (!sightmark || sightmark.length === 0) {
        throw new Error('No Sightmark Found')
      }

      return sightmark
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteSightmark (sightmarkId, userId) {
    try {
      const deletedSightmark = await SightmarkModel.findOneAndDelete({ _id: sightmarkId, createdBy: userId })

      if (!deletedSightmark) {
        throw new Error('No Sightmark Belonging to Current User found')
      }

      const equipmentId = deletedSightmark.equipment
      const equipment = await EquipmentModel.findById(equipmentId)
      if (equipment) {
        const index = equipment.sightmarks.indexOf(sightmarkId)
        if (index > -1) {
          equipment.sightmarks.splice(index, 1)
          await equipment.save()
        }
      }

      return deletedSightmark
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = Sightmark
