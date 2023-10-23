const mongoose = require('mongoose')
const {ArcherProfile} = require('../database/archerProfile.js')
const { sendDataResponse, sendErrorResponse } = require('../utils/responses.js')

const createArcherProfile = async (req, res) => {
  try {
    const userId = req.mongo_id
    const query = {
      createdBy: userId,
      bowType: req.body.bowType,
      handicap: req.body.handicap,
      user: new mongoose.Types.ObjectId(userId)
    }
    const result = await ArcherProfile.createArcherProfile(userId, query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getCurrentArcherProfiles = async (req, res) => {
  try {
    const userId = req.mongo_id
    const result = await ArcherProfile.getCurrentArcherProfiles(userId)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const searchArcherProfiles = async (req, res) => {
  try {
    const { minHandicap = 0, maxHandicap = 150, bowType } = req.body
    const query = {
      handicap: { $gte: minHandicap, $lte: maxHandicap },
      bowType
    }
    const result = await ArcherProfile.searchArcherProfiles(query)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const deleteArcherProfile = async (req, res) => {
  try {
    const userId = req.mongo_id
    const archerProfileId = req.params.id
    const result = await ArcherProfile.deleteArcherProfile(userId, archerProfileId)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const updateArcherProfile = async (req, res) => {
  try {
    const archerProfileId = req.params.id
    const userId = req.mongo_id
    const update = { bowType: req.body.bowType }
    const result = await ArcherProfile.updateArcherProfile(archerProfileId, userId, update)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

module.exports = {
  createArcherProfile,
  getCurrentArcherProfiles,
  searchArcherProfiles,
  deleteArcherProfile,
  updateArcherProfile
}