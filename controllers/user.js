const mongoose = require('mongoose')
const {User} = require('../database/user.js')
const { sendDataResponse, sendErrorResponse } = require('../utils/responses.js')
require('dotenv/config')
const ManagementClient = require('auth0')
const https = require('https')
// const querystring = require('querystring')
// const updateAuth0UserMetadata = require('../managementAPI.js')
// const ArcherProfile = require('../database/archerProfile.js')

// const auth0 = new ManagementClient({
//   domain: process.env.AUTH0_ISSUER_BASE_URL.replace('https://', ''),
//   clientId: process.env.AUTH0_CLIENT_ID,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET,
//   scope: 'read:users update:users'
// })

const createUser = async (req, res) => {
  try {
    const query = {
      auth0Id: req.auth0Id,
      email: req.body.email
    }
    const result = await User.createUser(query)

    const accessToken = req.managementApiToken
    const updatePayload = JSON.stringify({
      user_metadata: {
        mongo_id: result._id
      }
    })

    const updateOptions = {
      hostname: 'dev-wn87thdr6glngf33.uk.auth0.com',
      path: `/api/v2/users/${req.auth0Id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Length': Buffer.byteLength(updatePayload)
      }
    }

    const updateReq = https.request(updateOptions, (updateRes) => {
      let updateData = ''
      updateRes.on('data', (chunk) => {
        updateData += chunk
      })
      updateRes.on('end', () => {
        console.log('User metadata updated:', JSON.parse(updateData))
      })
    })

    updateReq.on('error', (error) => {
      console.error('Update Error:', error)
    })

    updateReq.write(updatePayload)
    updateReq.end()

    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.mongo_id
    const { firstName, lastName, bio, club } = req.body
    const update = { 'profile.firstName': firstName, 'profile.lastName': lastName, 'profile.bio': bio, 'profile.club': club }
    const result = await User.findAndUpdateProfile(userId, update)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getCurrentUser = async (req, res) => {
  try {
    const query = { _id: req.mongo_id }
    const currentUser = await User.findOne(query)
    return sendDataResponse(res, 200, currentUser)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getUsers = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.query
    const query = {}

    const fields = {
      // eslint-disable-next-line object-shorthand
      email: email,
      'profile.firstName': firstName,
      'profile.lastName': lastName
    }

    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        query[key] = new RegExp(value, 'i')
      }
    }

    const users = await User.findMany(query)
    return sendDataResponse(res, 200, users)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

const getUserById = async (req, res) => {
  const id = req.params.id

  try {
    const query = { _id: new mongoose.Types.ObjectId(id) }
    const user = await User.findOne(query)
    return sendDataResponse(res, 200, user)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

module.exports = {
  createUser,
  updateProfile,
  getCurrentUser,
  getUsers,
  getUserById
}