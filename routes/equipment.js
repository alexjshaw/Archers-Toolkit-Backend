const { extractAuth0Id, extractMongoId } = require('../auth.js')
const { createEquipment, updateEquipment, getUsersEquipment, getEquipmentById, searchEquipment, deleteEquipment } = require('../controllers/equipment.js')

var express = require('express');
var router = express.Router();

router.post('/', extractAuth0Id, extractMongoId, createEquipment)
router.put('/:id', extractMongoId, updateEquipment)
router.get('/', extractMongoId, getUsersEquipment)
router.get('/search', searchEquipment)
router.get('/:id', getEquipmentById)
router.delete('/:id', extractMongoId, deleteEquipment)

module.exports = router
