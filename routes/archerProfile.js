const { Router } = require('express')
const { createArcherProfile, getCurrentArcherProfiles, searchArcherProfiles, deleteArcherProfile, updateArcherProfile } = require('../controllers/archerProfile.js')
const { extractAuth0Id, extractMongoId } = require('../auth.js')

const router = Router()

router.post('/', extractMongoId, createArcherProfile)
router.get('/', extractMongoId, getCurrentArcherProfiles)
router.get('/search', searchArcherProfiles)
router.delete('/:id', extractMongoId, deleteArcherProfile)
// router.put('/:id', extractMongoId, updateArcherProfile)

module.exports = router
