var { Router } = require('express')
var { extractAuth0Id, extractMongoId } = require('../auth.js')
var { createSightmark, updateSightmark, getSightmarks, deleteSightmark, getEquipmentSightmarks } = require('../controllers/sightmark.js')

var express = require('express');
var router = express.Router();

router.post('/', extractMongoId, createSightmark)
router.put('/:id', extractMongoId, updateSightmark)
router.get('/', getSightmarks)
router.get('/:id', getEquipmentSightmarks)
router.delete('/:id', extractMongoId, deleteSightmark)

module.exports = router
