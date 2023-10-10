const User = require('./models/userModel.js')
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer')

const jwtCheck = auth({
  audience: 'http://new-archery-api',
  issuerBaseURL: 'https://dev-wn87thdr6glngf33.uk.auth0.com/'
})

const checkScopes = (scope) => requiredScopes(scope)

// const extractAuth0Id = (req, res, next) => {
//   req.auth0Id = req.auth.payload.sub
//   next()
// }

const extractAuth0Id = (req, res, next) => {
  console.log('req', req.headers.authorization);

  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization || '';
  const jwtToken = authHeader.split(' ')[1]; // Bearer <token>

  if (!jwtToken) {
    console.error('No token found');
    return next(new Error('No token found'));
  }

  // Decode the payload
  try {
    const payloadBase64Url = jwtToken.split('.')[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);

    // Access the `sub` value
    req.auth0Id = payload.sub;
  } catch (err) {
    console.error('Error decoding token:', err.message);
    return next(new Error('Error decoding token'));
  }

  next();
};


const extractMongoId = async (req, res, next) => {
  try {
    extractAuth0Id(req, res, () => {})

    const auth0Id = req.auth0Id
    const user = await User.findOne({ auth0Id })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    req.mongo_id = user._id
    next()
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  jwtCheck,
  checkScopes,
  extractAuth0Id,
  extractMongoId
}