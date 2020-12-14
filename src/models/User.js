const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//schema where we tell mongose about different properties
//that ever user in users collection is going to have
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

//function going to run before we save an instance of a user into database
//function keyword instead of arrow function to reference correct obj that contains our data
userSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

//attaching this method to every user that gets created
//that compares password provided by user to passwords in our db
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this
  // assemble a promise
  return new Promise((resolve, reject) => {
    //password already salted and stored in mongodb
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      if (!isMatch) {
        return reject(false)
      }
      resolve(true)
    })
  })
}

//associates with mongoose library
mongoose.model('User', userSchema)
