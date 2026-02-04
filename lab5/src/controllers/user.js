const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username)
      return callback(new Error("Wrong user parameters"), null)
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // Save to DB
    // Check if user already exists
    db.exists(user.username, (err, exists) => {
      if (err) return callback(err, null)
      if (exists) return callback(new Error("User already exists"), null)
      db.hmset(user.username, userObj, (err, res) => {
        if (err) return callback(err, null)
        callback(null, res) // Return callback
      })
    })
  },
  get: (username, callback) => {
    if(!username)
      return callback(new Error("Username must be provided"), null)
    db.hgetall(username, (err, res) => {
      if (err) return callback(err, null)
      if (res)
        callback(null, res)
      else
        callback(new Error("User not found"), null)
    })
  }
}
