const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})

describe('initial blogs in database', () => {
  test('blog are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)
  
  test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
  
      expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
    
  test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const titles = response.body.map(r => r.title)
      expect(titles).toContain(
        'Finance for Dummies'
      )
  })

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
  
    expect(resultBlog.body).toEqual(processedBlogToView)
  })
  
  test('unique identifier by default is _id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    expect(blogsAtStart[0].id).toBeDefined()
  })
})

describe('adding a blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "Cleaning for Dummies",
      author: "Bob Dylan",
      url: "www.bobwergbykoko.com",
      likes: 32032
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain(
      'Cleaning for Dummies'
    )
  })
  
  test('blog without content is not added', async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      likes: 12
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('like property missing, default to 0', async () => {
    const newBlog = {
      title: "Boxing for Dummies",
      author: "Bober Dylan",
      url: "www.boberdyl.com",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
  
    expect(addedBlog.likes).toBe(0)
  })
})

describe('updating a blog', () => {
  test('updating blog likes', async () => {
    const blogStart = (await helper.blogsInDb())[0]
    const updatedBlog = {
      ...blogStart,
      likes: 100
    }
    console.log(updatedBlog)
    await api
      .put(`/api/blogs/${blogStart.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const aBlogAtEnd = blogsAtEnd.find(b => b.id === blogStart.id)
    expect(aBlogAtEnd.likes).toBe(100)
  })
})

describe('deleting a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const titles = blogsAtEnd.map(r => r.title)
  
    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})