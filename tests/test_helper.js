const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: {
      _id: '5a422a851b54a676234d17f7',
    },
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      _id: '635214f50012681a13643d47',
    },
    __v: 0,
  },
  {
    _id: {
      _id: '5a422aa71b54a676234d17f8',
    },
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: {
      _id: '635214f50012681a13643d47',
    },
    __v: 0,
  },
  {
    _id: {
      _id: '5a422b3a1b54a676234d17f9',
    },
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: {
      _id: '635214f50012681a13643d47',
    },
    __v: 0,
  },
  {
    _id: {
      _id: '5a422b891b54a676234d17fa',
    },
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: {
      _id: '635214f50012681a13643d47',
    },
    __v: 0,
  },
  {
    _id: {
      _id: '5a422ba71b54a676234d17fb',
    },
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: {
      _id: '635214f50012681a13643d47',
    },
    __v: 0,
  },
  {
    _id: {
      _id: '5a422bc61b54a676234d17fc',
    },
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: {
      _id: '635214f50012681a13643d47',
    },
    __v: 0,
  },
]

const initialUsers = [
  {
    _id: {
      _id: '635214f50012681a13643d47',
    },
    username: 'hellas',
    name: 'Arto Hellas',
    passwordHash:
      '$2b$10$VVcAaRqyEs.2YvU0ISjAPePD6LFW0kbtsUjlEh1PLDk722qS3GLKi',
    blogs: [
      {
        _id: '5a422a851b54a676234d17f7',
      },
      {
        _id: '5a422aa71b54a676234d17f8',
      },
      {
        _id: '5a422b3a1b54a676234d17f9',
      },
      {
        _id: '5a422b891b54a676234d17fa',
      },
      {
        _id: '5a422ba71b54a676234d17fb',
      },
      {
        _id: '5a422bc61b54a676234d17fc',
      },
    ],
    __v: 6,
  },
  {
    _id: {
      _id: '635214f50012681a13643d4a',
    },
    username: 'mluukai',
    name: 'Matti Luukkainen',
    passwordHash:
      '$2b$10$2sgUVaajJiiBwVVWs72kLOMvE1wk8tANlqzdP29OvOF6bUFJyu/iG',
    blogs: [],
    __v: 0,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
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
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb,
}
