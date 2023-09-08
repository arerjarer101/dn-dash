import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

import prisma from '../prisma/prisma.js';
import { generateAccessToken } from './token.js'

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

    const isMatch = await bcrypt.compare(req.body.password, user.password)

    if (!isMatch) throw new Error('Incorrect username or password')

    console.log('user logged in ', user.username)
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign({user, createdAt: Date.now()}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    const userId = user.userId

    await prisma.RefreshTokens.create({ data: { token: refreshToken, userId: userId } }).then(
      res.json({ 
        accessToken: accessToken, 
        refreshToken: refreshToken, 
        user: {
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    )
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
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await prisma.user.create({
      data: {
        userId: id,
        email,
        username,
        password: hashedPassword
      },
    });

    console.log('user created ', newUser)
    const accessToken = generateAccessToken(newUser)
    const refreshToken = jwt.sign({user: newUser,createdAt: Date.now()}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
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