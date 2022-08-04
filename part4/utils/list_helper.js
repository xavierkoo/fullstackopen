const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => { 
    const total = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.length === 0
    ? 0
    : blogs.reduce(total, 0)
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const index = likes.indexOf(Math.max(...likes))
    return blogs[index]
}
  
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return "Blog list is empty"
    }

    const authorTop = 
        _.chain(blogs)
        .groupBy('author')
        .map((blogs, author) => {
            return {
                author: author,
                blogs: blogs.length
            }
        })
        .maxBy((blogObject) => blogObject.blogs)
        .value()
    return authorTop

}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return "Blog list is empty"
    }

    const authorLikes = 
        _.chain(blogs)
        .groupBy('author')
        .map((blogs, author) => {
            return {
                author: author,
                likes: blogs.reduce((sum, blog) => {
                    return sum += blog.likes
                }, 0)
            }
        })
        .maxBy((blogObject) => blogObject.likes)
        .value()
    return authorLikes

}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}