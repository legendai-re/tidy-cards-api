let logger = require('../../tools/winston')
let bCrypt = require('bcrypt-nodejs')
let connectionTypes = require('../../security/connectionTypes.json')
let m = require('../../models')
let sortTypes = require('../../models/customSort/sortTypes.json')
let usernameValidator = require('../../helpers/user/usernameValidator')
let updateEmail = require('../../helpers/user/updateEmail')

module.exports = function localSignup (params, callback) {
  // stop if some parameters are missing
  if (!requiredParamsOk(params)) { return callback(new m.ApiResponse('some required parameters where not provided', 400))}

  // stop if username is not valid
  if (!usernameValidator.isValid(params.username)) { return callback(new m.ApiResponse('username is not valid', 422))}

  // check if the username or the email is already used
  let regex = new RegExp(['^', params.username, '$'].join(''), 'i')
  m.User.findOne({ $or: [{username: regex}, {email: params.email.toLowerCase()}] }, function (err, foundedUser) {
    if (err) { logger.error(err); return callback(new m.ApiResponse(err, 500)) }

    // stop if username or email already used
    if (foundedUser) { return callback(new m.ApiResponse('email/username already taken', 422))}

    //  create user object
    let user = createUserObject(params)

    // save user to db
    user.save(function (err, user) {
      if (err) { logger.error(err); return callback(new m.ApiResponse(err, 500)) }

      // create customSort object, the one used to store user's collections
      let myCollectionSort = createMyCollectionCustomSortObject(user)

      // save customSort object to db
      myCollectionSort.save(function (err) {
        if (err) { logger.error(err); return callback(new m.ApiResponse(err, 500)) }

        // try to send email confirmation
        // do not stop the process even if it fail
        updateEmail.update(user, user.email, function (err, userAfterEmailUpdate) {
          if (err) { logger.warn(err) }

          // remove the password to do not send it
          user.local.password = ''

          // return new user
          callback(new m.ApiResponse(null, 200, user))
        })
      })
    })
  })
}

/**
 * Return true if all required parameters are defined and corrects
 */
function requiredParamsOk (params) {
  return params.username &&
            params.email &&
            params.password &&
            params.password.length > 3
}

/**
 * Create a user object using params data, it do not save the user to db
 */
function createUserObject (params) {
  let user = new m.User()
  user.email = params.email.toLowerCase()
  user.unsafeUsername = params.username
  user.username = params.username
  user.name = params.username
  user.local.password = createHash(params.password)
  user.local.active = true
  user.roles = (process.env.ADMIN_EMAILS.indexOf(params.email) > -1) ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER']
  user.language = (params.language || 'en')

  return user
}

/**
 * Create a customSort object, it do not save the user to db.
 * This customSort will be used to store the collections of the new user,
 * this is why we use the type MY_COLLECTIONS
 */
function createMyCollectionCustomSortObject (user) {
  let myCollectionSort = new m.CustomSort()
  myCollectionSort.type = sortTypes.MY_COLLECTIONS.id
  myCollectionSort._user = user._id

  return myCollectionSort
}

/**
 * Create hash of the password using the bCrypt library
 */
function createHash (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}
