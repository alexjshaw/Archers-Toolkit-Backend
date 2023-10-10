const { createUser, updateProfile, getUsers, getCurrentUser, getUserById } = require('../controllers/user.js')
const { extractAuth0Id, extractMongoId } = require('../auth.js')
const { updateAuth0UserMetadata } = require('../managementAPI.js')

var express = require('express');
var router = express.Router();

router.post('/', extractAuth0Id, updateAuth0UserMetadata, createUser)
router.put('/profile', extractMongoId, updateProfile)
router.get('/search', getUsers)
router.get('/', extractMongoId, getCurrentUser)
router.get('/:id', getUserById)

module.exports = router
