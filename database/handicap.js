var HandicapModel = require('../models/handicapModel.js')
var RoundTypeModel = require('../models/roundTypeModel.js')
var ScoreModel = require('../models/scoreModel.js')

class Handicap {
  static async handicapCalc (score, archerProfile) {
    try {
      const roundType = await RoundTypeModel.findById(score.roundType).select('name')
      const roundTypeName = roundType.name
      const finalScore = score.finalScore

      const query = {
        [`roundTypes.${roundTypeName}`]: { $lte: finalScore }
      }

      const handicapDocs = await HandicapModel.find(query)
        .sort({ Handicap: 1 })
        .limit(1)

      let scoreHandicap

      if (handicapDocs.length > 0) {
        scoreHandicap = Math.round(handicapDocs[0])
      } else {
        throw new Error('No matching handicap found')
      }

      score.handicap = scoreHandicap.Handicap
      await score.save()

      if (score.handicap < archerProfile.handicap) {
        archerProfile.scoreData.handicapScores.push(score)
      }

      if (archerProfile.scoreData.handicapScores.length >= 3) {
        const scoreDocs = await ScoreModel.find({
          _id: { $in: archerProfile.scoreData.handicapScores }
        }).select('handicap')

        const totalHandicap = scoreDocs.reduce((acc, scoreDoc) => acc + scoreDoc.handicap, 0)
        const averageHandicap = totalHandicap / scoreDocs.length

        archerProfile.handicap = averageHandicap
        archerProfile.scoreData.handicapScores = []
      }

      await archerProfile.save()
      return 'Score Handicap succesfully found'
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = Handicap