import express from 'express'
import prisma from '../prisma/prisma.js';
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, generateAccessToken } from './token.js'

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) throw new Error('Incorrect username or password')
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username
      }
    });
    if (!user) throw new Error('User doesn\'t exist')
    if (req.body.password !== user.password) throw new Error('Incorrect username or password')

    console.log('user logged in ', user)
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign({user, createdAt: Date.now()}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    const userId = user.userId

    await prisma.RefreshTokens.create({ data: { token: refreshToken, userId: userId } }).then(

    )
    delete user.userId
    delete user.password
    delete user.id

    console.log(user)
    console.log(user.password)

    res.json({ accessToken: accessToken, refreshToken: refreshToken, user: {
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!password || !username) throw new Error('incorrect password! ')
    const alreadyExists = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
    if (alreadyExists) throw new Error('User already exists')

    const id = uuidv4()
    const newUser = await prisma.user.create({
      data: {
        userId: id,
        email,
        username,
        password,
      },
    });

    console.log('user created ', newUser)
    const accessToken = generateAccessToken(newUser)
    const refreshToken = jwt.sign({newUser,createdAt: Date.now()}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
    const userId = newUser.userId

    await prisma.RefreshTokens.create({ data: { token: refreshToken, userId: userId } })

    res.json({ 
      accessToken: accessToken,
      refreshToken: refreshToken, 
      user: {
        username: newUser.username,
        email: newUser.email,
        games: newUser.games,
        characters: newUser.characters,
        participatedGames: newUser.participatedGames
      } 
    })
  } catch (error) {
    console.log(error.message)
    if (error.message === 'incorrect password!') res.status(500).json({ error: 'incorrect password!' });
    else res.status(500).json({ error: error.message });
  }
})

export default router