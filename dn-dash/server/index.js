import express from 'express'
import cors from 'cors'
import prisma from '../prisma/prisma.js'
import users from './users.js'
import auth from './auth.js'
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

// const cors = require('cors')
const port = 7070;
const hostname = 'localhost'

const app = express()
const tokenLifespan = 15

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/users', users)
app.use('/auth', auth)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/userId', authenticateToken, (req, res) => {

  console.log('req.user.userId', req.user.userId)

  const userId = req.user.userId

  res.json(userId)
})

app.get('/decoded', authenticateToken, (req, res) => {

  console.log('req.decoded', req.decoded)

  const decoded = req.decoded

  res.json(decoded)
})

app.post('/login', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username
      }
    });
    if (req.body.password !== user.password) throw new Error('wrong password!')

    console.log('user logged in ', user)
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign({user, createdAt: Date.now()}, process.env.REFRESH_TOKEN_SECRET)
    const userId = user.userId

    await prisma.RefreshTokens.create({ data: { token: refreshToken, userId: userId } })

    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  } catch (error) {
    if (error.message === 'wrong password!') res.status(500).json({ error: 'wrong password!' });
    else res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/token', async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) res.sendStatus(401)

  const existingToken = await prisma.RefreshTokens.findUnique({
    where: {
      token: refreshToken
    }
  })

  if (!existingToken) return res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)
    console.log('refresh token decoded', decoded)
    const accessToken = generateAccessToken(decoded.user)
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', authenticateToken, async (req, res) => {
  try {
    const deleteToken = await prisma.RefreshTokens.delete({
      where: {
        token: req.body.token
      }
    })
    res.json(deleteToken)
    // res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.delete('/logoutAll', authenticateToken, async (req, res) => {
  try {
    const deleteToken = await prisma.RefreshTokens.deleteMany({
      where: {
        userId: req.user.userId
      }
    })
    res.json(deleteToken)
    // res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)
    console.log('access token decoded ', decoded)
    req.user = decoded.user
    req.decoded = decoded
    console.log('req.user', req.user)
    next()
  })
}

function generateAccessToken(user) {
  const expiresIn = tokenLifespan + 'm'
  // const expiresAt = tokenLifespan * 60000
  return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn })
}

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})