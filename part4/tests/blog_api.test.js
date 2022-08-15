const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

// beforeEach functions as a way to wait for all async ops to finishing executing so database can be init
beforeEach(async () => {
  await Blog.deleteMany({})

  // array is created which consists of each blog in initialBlogs which is created with Blog constructor
  const blogObjects = helper.initialBlogs
    .map((blog) => new Blog(blog))
  // create new array that consists of promises for saving each of the items to the database
  const promiseArray = blogObjects.map((blog) => blog.save())
  // transforms an array of promises into a single promise that is fulfilled once every promise in the array is resolved
  await Promise.all(promiseArray)
})

describe('initial blogs in database', () => {
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      Authorization: `bearer ${result.body.token}`,
    }
  })

  test('blog are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set(headers)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set(headers)

    const titles = response.body.map((r) => r.title)
    expect(titles).toContain(
      'Finance for Dummies',
    )
  })

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .set(headers)
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
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      Authorization: `bearer ${result.body.token}`,
    }
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Cleaning for Dummies',
      author: 'Bob Dylan',
      url: 'www.bobwergbykoko.com',
      likes: 32032,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((r) => r.title)
    expect(titles).toContain(
      'Cleaning for Dummies',
    )
  })

  test('blog without content is not added', async () => {
    const newBlog = {
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('like property missing, default to 0', async () => {
    const newBlog = {
      title: 'Boxing for Dummies',
      author: 'Bober Dylan',
      url: 'www.boberdyl.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = await blogsAtEnd.find((blog) => blog.title === newBlog.title)
    expect(addedBlog.likes).toBe(0)
  })
})

describe('updating a blog', () => {
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      Authorization: `bearer ${result.body.token}`,
    }

    const newBlog = {
      title: 'The best blog ever',
      author: 'Me',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
  })

  test('updating blog likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[blogsAtStart.length - 1]
    const updatedBlog = {
      ...blogToUpdate,
      likes: 100,
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .set(headers)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const aBlogAtEnd = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
    expect(aBlogAtEnd.likes).toBe(100)
  })
})

describe('deleting a blog', () => {
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)

    const result = await api
      .post('/api/login')
      .send(newUser)

    headers = {
      Authorization: `bearer ${result.body.token}`,
    }

    const newBlog = {
      title: 'The best blog ever',
      author: 'Me',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1,
    )

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
