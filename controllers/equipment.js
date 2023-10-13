const mongoose = require('mongoose')
const Equipment = require('../database/equipment.js')
const { sendDataResponse, sendErrorResponse } = require('../utils/responses.js')

const createEquipment = async (req, res) => {
  try {
    const userId = req.mongo_id
    const query = {
      createdBy: userId,
      bowType: req.body.bowType,
      equipmentName: req.body.equipmentName,
      bowName: req.body.bowName,
      arrowName: req.body.arrowName,
      equipmentNotes: req.body.equipmentNotes,
      user: new mongoose.Types.ObjectId(userId)
    }
    const result = await Equipment.createEquipment(userId, query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const updateEquipment = async (req, res) => {
  try {
    const userId = req.mongo_id
    const equipmentId = req.params.id
    const update = {
      bowType: req.body.bowType,
      equipmentName: req.body.equipmentName,
      bowName: req.body.bowName,
      arrowName: req.body.arrowName,
      equipmentNotes: req.body.equipmentNotes
    }
    const result = await Equipment.updateEquipment(equipmentId, userId, update)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getUsersEquipment = async (req, res) => {
  try {
    const userId = req.mongo_id
    const result = await Equipment.getUsersEquipment(userId)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getEquipmentById = async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: new mongoose.Types.ObjectId(id) }
    const result = await Equipment.getEquipmentById(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const searchEquipment = async (req, res) => {
  try {
    const query = {}
    if (req.body.bowType) query.bowType = req.body.bowType
    if (req.body.equipmentName) query.equipmentName = req.body.equipmentName
    const result = await Equipment.searchEquipment(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const deleteEquipment = async (req, res) => {
  try {
    const userId = req.mongo_id
    const equipmentId = req.params.id
    const result = await Equipment.deleteEquipment(equipmentId, userId)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

/*
const equipmentSchema = new mongoose.Schema({
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sightmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sightmark' }]
})
*/

module.exports = {
  createEquipment,
  updateEquipment,
  getUsersEquipment,
  getEquipmentById,
  searchEquipment,
  deleteEquipment
}