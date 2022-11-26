const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })

  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false

  if (!(user && passwordCorrect))
    return response.status(400).json({ error: 'invalid username or password' })

  const token =
    'bearer ' + jwt.sign({ username, id: user.id }, process.env.SECRET)

  response.status(200).send({ token, username, name: user.name, id: user.id })
})

module.exports = loginRouter
