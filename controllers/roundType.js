var mongoose = require('mongoose')
var {RoundType} = require('../database/roundType.js')
var { sendDataResponse, sendErrorResponse } = require('../utils/responses.js')

const createRoundType = async (req, res) => {
  try {
    const distancesWithNum = req.body.distances.map((distance, index) => ({
      ...distance,
      distanceNum: index + 1
    }))
    const totalDozens = distancesWithNum.reduce((acc, curr) => acc + curr.numDozens, 0)
    const minDistance = Math.min(...req.body.distances.map(d => d.distance))
    const maxDistance = Math.max(...req.body.distances.map(d => d.distance))
    const query = {
      ...req.body,
      distances: distancesWithNum,
      totalDozens,
      createdBy: req.mongo_id,
      minDistance,
      maxDistance
    }
    const result = await RoundType.createRoundType(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getRoundTypeById = async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: new mongoose.Types.ObjectId(id) }
    const result = await RoundType.getRoundTypeById(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const returnRoundTypeNames = async (req, res) => {
  try {
    const result = await RoundType.returnRoundTypeNames()
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const searchRoundType = async (req, res) => {
  try {
    const { name, type, minTotalDozens = 0, maxTotalDozens = 48, minDistance, maxDistance } = req.body
    const query = {
      ...(name && { name: new RegExp(name, 'i') }),
      ...(type && { type }),
      totalDozens: {
        $gte: minTotalDozens,
        $lte: maxTotalDozens
      },
      ...(minDistance && { minDistance: { $gte: minDistance } }),
      ...(maxDistance && { maxDistance: { $lte: maxDistance } })
    }
    const result = await RoundType.searchRoundType(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const updateRoundType = async (req, res) => {
  try {
    const roundTypeId = req.params.id
    const userId = req.mongo_id
    const update = req.body
    const result = await RoundType.updateRoundType(roundTypeId, userId, update)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const updateRoundDistance = async (req, res) => {
  try {
    const roundTypeId = req.params.id
    const userId = req.mongo_id
    const updatesArray = req.body
    const updatedRoundType = await RoundType.updateRoundDistance(roundTypeId, userId, updatesArray)
    return sendDataResponse(res, 200, updatedRoundType)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const deleteRoundType = async (req, res) => {
  try {
    const roundTypeId = req.params.id
    const result = await RoundType.deleteRoundType(roundTypeId, req.mongo_id)
    if (!result) {
      return sendErrorResponse(res, 404, 'RoundType not found or unauthorized')
    }
    return sendDataResponse(res, 200, { message: 'RoundType deleted successfully' })
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const deleteRoundDistance = async (req, res) => {
  try {
    const distanceId = req.params.id
    const result = await RoundType.deleteRoundDistance(distanceId, req.mongo_id)
    if (!result) {
      return sendErrorResponse(res, 404, 'Distance not found or unauthorized')
    }
    return sendDataResponse(res, 200, { message: 'Distance deleted successfully' })
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

module.exports = {
  createRoundType,
  getRoundTypeById,
  returnRoundTypeNames,
  searchRoundType,
  updateRoundType,
  updateRoundDistance,
  deleteRoundType,
  deleteRoundDistance
}