const jwt = require('jsonwebtoken');
const config = require('../config').cfg
const customExceptions = require('../responseModels/customExceptions')

const authenticateBasicAuthAPI = (req, res, next) => {   
  // -----------------------------------------------------------------------
  // authentication middleware
  const auth = {login: config.BASIC_AUTH_LOGIN, password: config.BASIC_AUTH_PASSWORD} // change this

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next()
  }

  // Access denied...
  // res.set('WWW-Authenticate', 'Basic realm="401"') // change this
  return res.status(401).send({Error:'Authentication required.'}) // custom message
}


module.exports = {
  authenticateBasicAuthAPI
}