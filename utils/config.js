require('dotenv').config()

const PORT = process.env.PORT

var MONGODB_URI
switch (process.env.NODE_ENV) {
  case 'test':
    MONGODB_URI = process.env.TEST_MONGODB_URI
    break
  case 'local':
    MONGODB_URI = process.env.LOCAL_MONGODB_URI
    break
  default:
    MONGODB_URI = process.env.MONGODB_URI
    break
}

module.exports = { PORT, MONGODB_URI }
