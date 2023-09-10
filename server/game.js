import express from 'express'

import prisma from '../prisma/prisma.js'
import { authenticateToken } from './token.js'

const router = express.Router();

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const createdGame = await prisma.game.create({
      data: {
        name: req.body.game.name,
        creator: {
          connect: {
            id: req.user.id
          },
        },
      },
    })

    res.json({ createdGame })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.get('/created', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      include: {
        games: true
      }
    })
    const userGames = user.games

    res.json({ userGames })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.post('/delete', authenticateToken, async (req, res) => {
  try {
    const deletedGame = await prisma.game.delete({
      where: {
        id: req.body.game.id
      },
    })

    res.json({ deletedGame })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

export default router