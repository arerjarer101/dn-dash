import express from 'express'
import prisma from '../prisma/prisma.js';
import { authenticateToken, generateAccessToken } from './token.js'

const router = express.Router();

router.post('/update', authenticateToken, async (req, res) => {
  try {
    const newdata = req.body.newdata
    if (!newdata.username || !newdata.oldpassword) throw new Error('Necessary fields cannot be empty')
    const user = await prisma.user.findUnique({
      where: {
        username: req.user.username
      }
    });
    if (newdata.oldpassword !== user.password) throw new Error('Incorrect password')
    const alreadyExists = await prisma.user.findUnique({
      where: {
        username: newdata.username
      }
    })
    if (alreadyExists && alreadyExists.username !== req.user.username) throw new Error('User already exists')
    

    const updatedUser = await prisma.user.update({
      where: {
        username: req.user.username
      },
      data: {
        username: newdata.username,
        password: newdata.newpassword ? newdata.newpassword : newdata.oldpassword,
        email: newdata.email
      }
    })

    const oldUserFields = Object.keys(user)
    const updatedUserFields = Object.keys(updatedUser)

    console.log(oldUserFields)
    console.log(updatedUserFields)

    Object.keys(newdata)

    console.log('user updated ', updatedUser)
    delete updatedUser.userId
    delete updatedUser.password
    delete updatedUser.id
    res.json({ user: {
        email: updatedUser.email,
        username: updatedUser.username,
        updatedAt: updatedUser.updatedAt
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.delete('/logout', authenticateToken, async (req, res) => {
  try {
    console.log(req.body)
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

router.delete('/logoutAll', authenticateToken, async (req, res) => {
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

router.get('/userId', authenticateToken, (req, res) => {

  console.log('req.user.userId', req.user.userId)

  const userId = req.user.userId

  res.json(userId)
})

export default router