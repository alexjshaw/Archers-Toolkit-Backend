var mongoose = require('mongoose')
var {Score} = require('../database/score.js')
var { sendDataResponse, sendErrorResponse } = require('../utils/responses.js')

const createScore = async (req, res) => {
  try {
    const userId = req.mongo_id
    const query = {
      ...req.body,
      createdBy: userId
    }
    const isValid = await Score.validateOwnership(userId, query.archerProfile, query.equipment)

    if (!isValid) {
      return sendErrorResponse(res, 400, 'The equipment or archer profile does not belong to the current user')
    }

    const result = await Score.createScore(userId, query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const updateScore = async (req, res) => {
  try {
    // const allowedUpdates = ['notes', 'location', 'weather', 'equipment', 'visible', 'arrowValues']
    // const query = filterAllowedUpdates(req.body, allowedUpdates)
    const query = req.body
    const scoreId = req.params.id
    const userId = req.mongo_id.toString()

    const result = await Score.updateScore(userId, scoreId, query)

    if (!result) {
      return sendErrorResponse(res, 404, 'Score not found')
    }
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const deleteScore = async (req, res) => {
  console.log('deleteScore running')
  try {
    const scoreId = req.params.id
    const result = await Score.deleteScore(req.mongo_id, scoreId)
    if (!result) {
      return sendErrorResponse(res, 404, 'Score not found or did not belong to user')
    }
    return sendDataResponse(res, 200, { message: 'Score deleted successfully' })
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const searchScores = async (req, res) => {
  try {
    const query = { ...req.query }
    const scores = await Score.findMany(query)
    return sendDataResponse(res, 200, scores)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const currentUserScores = async (req, res) => {
  try {
    const createdBy = req.mongo_id
    const query = { createdBy }
    const scores = await Score.findMany(query)
    return sendDataResponse(res, 200, scores)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

/*
finalScore: { type: Number, required: true, default: 0 },
runningTotal: { type: Number, required: true, default: 0 },
scored10s: { type: Number, required: true, default: 0 },
scoredXs: { type: Number, required: true, default: 0 },
*/

module.exports = {
  createScore,
  updateScore,
  deleteScore,
  searchScores,
  currentUserScores
}