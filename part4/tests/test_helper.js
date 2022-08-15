const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    id: '5a422a851b54a676234d17f7',
    title: 'Finance for Dummies',
    author: 'Bob Bobby',
    url: 'www.bobbykoko.com',
    likes: 350,
  },
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Marketing for Dummies',
    author: 'Bob Bobber',
    url: 'www.bobbykoko.com',
    likes: 3203,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Removing for Dummies',
    author: 'Brandon Bobby',
    url: 'www.bradkoko.com',
    likes: 20,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb,
}
