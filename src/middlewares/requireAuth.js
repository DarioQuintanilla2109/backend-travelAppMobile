const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

//inspect that incoming request
//all request are downcased automatically
module.exports = (req, res, next) => {
  const { authorization } = req.headers
  //authorization === 'Bearer fdgrtdghdgh.. '
  if (!authorization) {
    return res.status(401).send('You must be logged in')
  }

  //strips away bearer and left with only token
  const token = authorization.replace('Bearer ', '')
  //payload == information we have in our json web token { userId: user._id }
  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be logged in' })
    }
    const { userId } = payload

    //look at our mongo db collection and find who made the request
    const user = await User.findById(userId)

    //other request handlers can have access to our user model
    req.user = user
    //sign that our middle ware is done running
    next()
  })
}
