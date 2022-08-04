const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require("../utils/logger")

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    if (!body.likes) {
        body.likes = 0
    }

    if (!body.comments) {
        body.comments = []
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })  
    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.get('/:id', async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
    response.json(blog)
    } else {
    response.status(404).end()
    }
})
    
blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const blog = request.body

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        logger.info(`blog ${updatedBlog.title} successfully updated`)
        response.json(updatedBlog)
    } catch (exception) {
            next(exception)
    }
})

module.exports = blogsRouter