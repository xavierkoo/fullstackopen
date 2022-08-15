const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
  // populate shows everything in object, 2nd arg defines what to show
    .find({}).populate('blogs', { title: 1, author: 1 })
  response.json(users.map((user) => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const { body } = request

  if (body.password.length < 3) {
    return response.status(400).json({ error: 'User validation failed: username: Path password is shorter than the minimum allowed length (3)' })
  }
  // start: below is not necessary if mongoose unique validator works with version 6.x
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }
  // end

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
