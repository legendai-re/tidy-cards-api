let slug = require('slug')
let models = require('../../models')
let imagesTypes = require('../../models/image/imageTypes.json')
let sortTypes = require('../../models/customSort/sortTypes.json')
let forbiddenUsernames = require('../../helpers/user/forbiddenUsernames.json')
let imageUpdloader = require('../../helpers/image-uploader')
let updateEmail = require('../../helpers/user/updateEmail')

let createUser = function (req, profile, accessToken, strategy, callback) {
  let sess = req.session
  let newUser = new models.User()
  let profileEmail
  if (profile.emails && profile.emails.length > 0) { profileEmail = profile.emails[0].value } else { profileEmail = '' }

  // check if email alreday used
  models.User.findOne({email: profileEmail.toLowerCase()}, function (err, user) {
    if (err) { console.log(err); return callback(err) }
    if (user) return callback('email already used')

    newUser[strategy].id = profile.id
    newUser[strategy].token = accessToken

    if (profile.displayName) {
      let slugDdisplayName = slug(profile.displayName, '-')
      newUser.unsafeUsername = (forbiddenUsernames.indexOf(slugDdisplayName.toLowerCase()) > -1) ? 'forbidden-name' : slugDdisplayName
    } else {
      newUser.unsafeUsername = 'anonyme'
    }
    newUser.name = (profile.displayName || 'anonyme')
    newUser.roles = ['ROLE_USER']
    newUser.language = (sess.language || 'en')

    createAvatar(newUser, profile, function (image) {
      let avatar = image
      newUser._avatar = avatar._id

      newUser.save(function (err) {
        if (err) { return callback(err) }

        // if no email
        if (profileEmail != '') {
          updateEmail.update(newUser, profileEmail, function (err, newUser) {
            if (err) { console.log(err) }
            avatar.save(function (err) {
              if (err) { return callback(err) }
              newUser._avatar = avatar
              createMyCollectionSort(newUser, function (err) {
                if (err) { return callback(err) }
                callback(null, newUser)
              })
            })
          })
        } else {
          avatar.save(function (err) {
            if (err) { return callback(err) }
            newUser._avatar = avatar
            createMyCollectionSort(newUser, function (err) {
              if (err) { return callback(err) }
              callback(null, newUser)
            })
          })
        }
      })
    })
  })
}

function createMyCollectionSort (newUser, callback) {
  let myCollectionSort = new models.CustomSort()
  myCollectionSort.type = sortTypes.MY_COLLECTIONS.id
  myCollectionSort._user = newUser._id
  myCollectionSort.save(function (err) {
    callback(err)
  })
}

function createAvatar (newUser, profile, callback) {
  let image = new models.Image()
  image.type = imagesTypes.AVATAR.name
  image.mime = 'jpg'
  image._user = newUser._id
  if (profile.photos && profile.photos[0]) {
    imageUpdloader.getSocialNetworkAvatar(image, profile.photos[0].value, function (err) {
      callback(image)
    })
  } else {
    callback(image)
  }
}

module.exports = {
  createUser: createUser
}
