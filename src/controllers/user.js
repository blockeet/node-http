const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/user')

exports.list = async (req, res, next) => {
  let { page = 1, size = 10 } = req.query
  page = parseInt(page)
  size = parseInt(size)
  const number = (page - 1) * size
  const data = await User.find({}).sort({ create_date: -1 }).limit(size).skip(number)
  res.json({ status: 1, message: 'ok', data: data})
}

exports.detail = async (req, res, next) => {
  const { id } = req.params
  const data = await User.findById(id)

   res.json({ status: 1, message: 'ok', data: data})
}

exports.add = async ( req, res, next) => {
  const { username, email, password } = req.body
  const newUser = new User({
    username,
    email,
    password
  })
  const data = await newUser.save()
  if(!data) {
    res.json({ status: 0, message: 'error'})
  } else {
    res.json({ status: 1, message: 'ok', data: data})
  }
}

exports.update = async (req, res, next) => {
  const { id, username, email, password } = req.body
  console.log( id, username, email, password)
  const data = await User.findByIdAndUpdate(id, {
    username,
    email,
    password
  })
  if (!data) {
    res.json({ status: 0, message: 'error'})
  } else {
    res.json({ status: 1, message: 'ok', data: data})
  }
}

exports.delete = async (req, res, next) => {
  const { id } = req.params
  const data = await User.findByIdAndRemove(id)
  if(!data) {
    res.json({ status: 0, message: 'error'})
  } else {
    res.json({ status: 1, message: 'ok', data: data})
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body
  const dbUser = await User.findOne({ username})
  if (!dbUser) {
    return res.json({ status: 0, message: '用户不存在'})
  }
  const { _id, password: dbPassword } = dbUser
  if (password === dbPassword) {
    const { secret, expiresIn } = config
    const payload = { id: _id }
    const token = jwt.sign(payload, secret, {
      expiresIn
    })
    res.json({ status: 1, message: 'ok', data: { token: token}})
  } else {
    res.json({ status: 0, message: '用户名或密码错误'})
  }
}