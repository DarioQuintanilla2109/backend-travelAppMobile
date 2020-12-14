//makes sure our files run at least once
require('./models/User')
require('./models/Track')
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const trackRoutes = require('./routes/trackRoutes')
const requireAuth = require('./middlewares/requireAuth')

//handles incoming json information
const bodyParser = require('body-parser')

//app represents our entire application
const app = express()

//makes sure all our json info is parsed first
app.use(bodyParser.json())

// associates all our request handlers with our main express app
app.use(authRoutes)

app.use(trackRoutes)

//string to connect to our db instance
const mongoURI =
  'mongodb+srv://admin:Dario2109@cluster0.yr1uz.mongodb.net/<dbname>?retryWrites=true&w=majority'
mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})

//anytime we succesfully connect to our db instance this will run
mongoose.connection.on('connected', () => {
  console.log('connected to mongo insatnce')
})

mongoose.connection.on('error', err => {
  console.error('Error connecting to mongo', err)
})

//req == http request //// res -> outgoing response
//middle ware included here to verify before sending data, if ok -> have access to route
app.get('/', requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`)
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
