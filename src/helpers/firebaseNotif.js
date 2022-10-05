var admin = require('firebase-admin')

var serviceAccount = require('../../boowallet-1581b-firebase-adminsdk-pfo7k-a6b6f6b04a.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = admin
