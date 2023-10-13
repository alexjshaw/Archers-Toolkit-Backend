const EquipmentModel = require('../models/equipmentModel.js')
const SightmarkModel = require('../models/sightmarkModel.js')
const UserModel = require('../models/userModel.js')
const mongoose = require('mongoose')

class Equipment {
  static async createEquipment (userId, query = {}) {
    try {
      const newEquipment = new EquipmentModel(query)
      await newEquipment.save()

      const user = await UserModel.findById(userId)

      user.equipments.push(newEquipment._id)
      await user.save()

      return newEquipment
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateEquipment (equipmentId, userId, update) {
    try {
      const updatedEquipment = await EquipmentModel.findOneAndUpdate(
        { _id: equipmentId, createdBy: userId.toString() },
        { $set: update },
        { new: true, runValidators: true }
      )
      if (!updatedEquipment) {
        throw new Error('No Equipment Belonging to Current User Found')
      }

      return updatedEquipment
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getUsersEquipment (userId) {
    try {
      const usersEquipment = await EquipmentModel.find({ user: userId }).exec()
      if (!usersEquipment || usersEquipment.length === 0) {
        return { success: false, message: 'No ArcherProfiles found' }
      }
      return usersEquipment
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async getEquipmentById (query = {}) {
    try {
      const equipment = await EquipmentModel.findOne(query)
      return equipment
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async searchEquipment (query = {}) {
    try {
      if (query.equipmentName) {
        query.equipmentName = new RegExp(query.equipmentName, 'i')
      }

      const equipment = await EquipmentModel.find(query).exec()

      if (!equipment || equipment.length === 0) {
        throw new Error('No Equipment found')
      }
      return equipment
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteEquipment (equipmentId, creatorId) {
    try {
      const deletedEquipment = await EquipmentModel.findOneAndDelete({ _id: equipmentId, createdBy: creatorId.toString() })

      if (!deletedEquipment) {
        throw new Error('No Equipment Belonging to Current User found')
      }

      await SightmarkModel.deleteMany({ equipment: equipmentId })

      const userId = deletedEquipment.user
      const user = await UserModel.findById(userId)
      if (user) {
        const index = user.equipments.indexOf(equipmentId)
        if (index > -1) {
          user.equipments.splice(index, 1)
          await user.save()
        }
      }

      return deletedEquipment
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = { Equipment }