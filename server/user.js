import express from 'express'
import bcrypt from 'bcrypt'

import prisma from '../prisma/prisma.js';
import { authenticateToken } from './token.js'

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

    const isMatch = await bcrypt.compare(newdata.oldpassword, user.password)
    if (!isMatch) throw new Error('Incorrect password')

    const alreadyExists = await prisma.user.findUnique({
      where: {
        username: newdata.username
      }
    })
    if (alreadyExists && alreadyExists.username !== req.user.username) throw new Error('User already exists')
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = newdata.newpassword ? await bcrypt.hash(newdata.newpassword, salt) : user.password

    const updatedUser = await prisma.user.update({
      where: {
        username: req.user.username
      },
      data: {
        username: newdata.username,
        password: hashedPassword,
        email: newdata.email
      }
    })

    //  TODO: send back info which fields were updated
    // const oldUserFields = Object.keys(user)
    // const updatedUserFields = Object.keys(updatedUser)
    // console.log(oldUserFields)
    // console.log(updatedUserFields)

    console.log('user updated ', updatedUser)

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
    const deleteToken = await prisma.RefreshTokens.delete({
      where: {
        token: req.body.token
      }
    })
    console.log('user logged out', deleteToken)
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
    console.log('user terminated all sessions', deleteToken)
    res.json(deleteToken)
    // res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
})

// router.get('/user', authenticateToken, (req, res) => {

//   const user = req.user

//   console.log('get user', user)

//   res.json(user)
// })

router.get('/userId', authenticateToken, (req, res) => {

  console.log('req.user.userId', req.user.userId)

  const userId = req.user.userId

  res.json(userId)
})

export default router