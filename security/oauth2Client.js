let google = require('googleapis')
let OAuth2 = google.auth.OAuth2

let oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:8080/auth/admin/google/callback')

module.exports = oauth2Client
