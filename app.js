const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const mongoServer = require('./mongodb-memory-server')

if (process.env.NODE_ENV === 'test') {
  mongoServer.startInMemoryMongoDB()
}

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error to connecting MongoDB', error.message))

app.use(cors())
app.use(express.json())

app.use('/login', loginRouter)
app.use('/api/users', usersRouter)

app.use('/api/blogs', middleware.userExtractor, blogRouter)

if (process.env.NODE_ENV == 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app
