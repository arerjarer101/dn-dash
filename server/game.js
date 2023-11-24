import express from 'express'

import prisma from '../prisma/prisma.js'
import { authenticateToken } from './token.js'

const router = express.Router();

router.post('/create', authenticateToken, async (req, res) => {
  try {
    console.log(req.body.game)
    const createdGame = await prisma.game.create({
      data: {
        name: req.body.game.name,
        gameData: JSON.stringify(req.body.game.gameData),
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

router.get('/by/:id', authenticateToken, async (req, res) => {
  try {
    const updatedGame = await prisma.game.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      include: {
        players: true,
        characters: true
      }
    })
    updatedGame.gameData = JSON.parse(updatedGame.gameData)
    res.json({ updatedGame })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.get('/created', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.id)
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      include: {
        games: {
          include: {
            players: true,
            characters: true
          }
        }
      }
    })

    const userGames = user.games
    userGames.forEach(e => {
      e.gameData = JSON.parse(e.gameData)
    })

    res.json({ userGames })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.get('/participated', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.id)
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      include: {
        participatedGames: {
          include: {
            players: true,
            characters: true
          }
        }
      }
    })

    const userGames = user.participatedGames
    userGames.forEach(e => {
      e.gameData = JSON.parse(e.gameData)
      // console.log('user.id', user.id)
      // console.log('e.characters', e.characters)
      e.characters = e.characters.filter(character => {
        console.log('user.id', user.id)
        console.log('e.characters.character.userId', character.userId)
        return character.userId === user.id
      })
    })

    res.json({ userGames })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.post('/update/gameData', authenticateToken, async (req, res) => {
  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: req.body.game.id
      },
      data: {
        gameData: JSON.stringify(req.body.game.gameData)
      },
      include: {
        players: true,
        characters: true
      }
    })

    updatedGame.gameData = JSON.parse(updatedGame.gameData)

    res.json({ updatedGame })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.post('/update/players', authenticateToken, async (req, res) => {
  console.log(req.body.game)
  const players = req.body.game.players.map(player => { 
    return { id: player.id }
  })
  console.log(players)

  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: req.body.game.id
      },
      data: {
        players: {
          connect: players
        }
      },
      include: {
        players: true,
        characters: true
      }
    })
    updatedGame.gameData = JSON.parse(updatedGame.gameData)
    console.log("updatedGame", updatedGame)
    res.json({ updatedGame })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.post('/remove/player', authenticateToken, async (req, res) => {
  console.log(req.body.game.players)
  const players = req.body.game.players.map(player => { 
    return { id: player.id }
  })
  console.log(players)

  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: req.body.game.id
      },
      data: {
        players: {
          disconnect: players
        }
      },
      include: {
        players: true,
        characters: true
      }
    })
    updatedGame.gameData = JSON.parse(updatedGame.gameData)
    res.json({ updatedGame })
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

router.post('/add/character', authenticateToken, async (req, res) => {
  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: req.body.data.gameId
      },
      data: {
        characters: {
          connect: [{ id: req.body.data.characterId}]
        }
      },
      include: {
        players: true,
        characters: true
      }
    })
    updatedGame.gameData = JSON.parse(updatedGame.gameData)
    console.log("updatedGame", updatedGame)
    res.json({ updatedGame })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

export default router