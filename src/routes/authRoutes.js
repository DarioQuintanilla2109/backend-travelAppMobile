const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

//router obj to associate route handlers to route back app obj that we created in index.js
const router = express.Router()

router.post('/signup', async (req, res) => {
  //destructering req obj
  const { email, password } = req.body

  try {
    const user = new User({ email, password })

    await user.save()
    //making our token
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
    res.send({ token: token })
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

//anyone calling signin route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).send({ error: 'Must prvide email and password' })
  }

  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(422).send({ error: 'Email not found' })
  }

  try {
    await user.comparePassword(password)
    const token = jwt.sign({ user: user._id }, 'MY_SECRET_KEY')
    res.send({ token: token })
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' })
  }
})

module.exports = router
