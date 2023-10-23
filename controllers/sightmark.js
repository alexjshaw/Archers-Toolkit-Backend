var mongoose = require('mongoose')
var {Sightmark} = require('../database/sightmark.js')
var { sendDataResponse, sendErrorResponse } = require('../utils/responses.js')

const createSightmark = async (req, res) => {
  try {
    const { distance, distanceType, sightPosition, notes, equipmentId } = req.body
    const query = {
      createdBy: req.mongo_id,
      distance,
      distanceType,
      sightPosition,
      notes,
      equipment: new mongoose.Types.ObjectId(req.body.equipmentId)
    }
    const result = await Sightmark.createSightmark(equipmentId, query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const updateSightmark = async (req, res) => {
  try {
    const userId = req.mongo_id
    const sightmarkId = req.params.id
    const update = {
      distance: req.body.distance,
      distanceType: req.body.distanceType,
      sightPosition: req.body.sightPosition,
      notes: req.body.notes
    }
    const result = await Sightmark.updateSightmark(sightmarkId, userId, update)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getSightmarks = async (req, res) => {
  try {
    const query = {}
    if (req.body.equipment) query.equipment = req.body.equipment
    if (req.body.distance) query.distance = req.body.distance
    if (req.body.distanceType) query.distanceType = req.body.distanceType
    const result = await Sightmark.getSightmarks(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getEquipmentSightmarks = async (req, res) => {
  try {
    const query = { equipment: req.params.id }
    const result = await Sightmark.getSightmarks(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const deleteSightmark = async (req, res) => {
  try {
    const sightmarkId = req.params.id
    const userId = req.mongo_id
    const result = await Sightmark.deleteSightmark(sightmarkId, userId)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

module.exports = {
  createSightmark,
  updateSightmark,
  getSightmarks,
  getEquipmentSightmarks,
  deleteSightmark
}