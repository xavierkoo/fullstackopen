const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  // populate shows everything in object, 2nd arg defines what to show
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map((blog) => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const { body } = request
  const { user } = request

  if (!body.likes) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })
  try {
    const savedBlog = await blog.save()
    logger.info(`added ${blog.title} to the blog list`)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    logger.info(`blog linked to user ${user.username}`)
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { user } = request

  const blogToDelete = await Blog.findById(request.params.id)
  if (blogToDelete.user._id.toString() === user._id.toString()) {
    try {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } catch (exception) {
      next(exception)
    }
  } else {
    return response.status(401).json({ error: 'Unauthorized' })
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body
  const { user } = request

  const blogToUpdate = await Blog.findById(request.params.id)
  if (blogToUpdate.user._id.toString() === user._id.toString()) {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      logger.info(`blog ${updatedBlog.title} successfully updated`)
      response.json(updatedBlog)
    } catch (exception) {
      next(exception)
    }
  } else {
    return response.status(401).json({ error: 'Unauthorized' })
  }
})

module.exports = blogsRouter
