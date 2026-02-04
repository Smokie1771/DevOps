const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    if(!user.username)
      return callback(new Error("Wrong user parameters"), null)

    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }

    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null)
      callback(null, res)
    })
  },

  get: (username, callback) => {
    if (!username)
      return callback(new Error("Wrong username"), null)

    db.hgetall(username, (err, user) => {
      if (err) return callback(err, null)
      if (!user) return callback(new Error("User not found"), null)

      callback(null, {
        username: username,
        firstname: user.firstname,
        lastname: user.lastname
      })
    })
  }
}
