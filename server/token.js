import prisma from '../prisma/prisma.js'
import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()
const tokenLifespan = '15s'

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)
    req.user = decoded.user
    req.decoded = decoded
    console.log('authenticateToken() -> user authenticated', decoded)
    next()
  })
}

function generateAccessToken(user) {
  return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: tokenLifespan })
}

router.post('/refresh', authenticateToken, async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)

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

router.get('/loggedIn', authenticateToken, async (req, res) => {
  try {
    const session = await prisma.RefreshTokens.findUnique({
      where: {
        token: req.query.refreshToken
      }
    })
    const loggedInStatus = req.user.userId === session.userId ? true : false
    console.log('user logged in state', loggedInStatus)
    res.json(loggedInStatus)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
  
})

export default router
export { authenticateToken, generateAccessToken }
