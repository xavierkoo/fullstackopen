const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: "Finance for Dummies",
      author: "Bob Bobby",
      url: "www.bobbykoko.com",
      likes: 350,
    },
    {
      title: "Marketing for Dummies",
      author: "Bob Bobber",
      url: "www.bobbykoko.com",
      likes: 3203,
    }
  ]

const nonExistingId = async () => {
    const blog = new Blog({
        title: "Removing for Dummies",
        author: "Brandon Bobby",
        url: "www.bradkoko.com",
        likes: 20,
    })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(note => note.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}