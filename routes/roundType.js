var { Router } = require('express')
var { extractAuth0Id, extractMongoId } = require('../auth.js')
var { createRoundType, getRoundTypeById, searchRoundType, updateRoundType, updateRoundDistance, deleteRoundType, deleteRoundDistance, returnRoundTypeNames } = require('../controllers/roundType.js')

var express = require('express');
var router = express.Router();

router.post('/', extractMongoId, createRoundType)
router.get('/search', searchRoundType)
router.get('/', returnRoundTypeNames)
router.get('/:id', getRoundTypeById)
router.put('/:id', extractMongoId, updateRoundType)
router.put('/distance/:id', extractMongoId, updateRoundDistance)
router.delete('/:id', extractMongoId, deleteRoundType)
router.delete('/distance/:id', extractMongoId, deleteRoundDistance)

module.exports = router
