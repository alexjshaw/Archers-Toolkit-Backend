var { Router } = require('express')
var { extractAuth0Id, extractMongoId } = require('../auth.js')
var { createScore, updateScore, deleteScore, searchScores, currentUserScores } = require('../controllers/score.js')

var express = require('express');
var router = express.Router();

router.get('/', extractMongoId, searchScores)
router.get('/currentuser', extractMongoId, currentUserScores)
router.post('/', extractMongoId, createScore)
router.put('/:id', extractMongoId, updateScore)
router.delete('/:id', extractMongoId, deleteScore)

module.exports = router
