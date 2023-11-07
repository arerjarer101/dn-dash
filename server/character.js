import express from 'express'

import prisma from '../prisma/prisma.js'
import { authenticateToken } from './token.js'

const router = express.Router();

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const character = req.body.character
    console.log('CREATING CHARACTER ', character)
    character.charData = JSON.stringify(character.charData)

    const createdCharacter = await prisma.character.create({
      data: {
        name: character.name,
        charData: character.charData,
        user: {
          connect: {
            id: character.playerId
          },
        },
      },
    })

    createdCharacter.charData = JSON.parse(createdCharacter.charData)
    res.json({ createdCharacter })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.post('/update', authenticateToken, async (req, res) => {
  try {
    const character = req.body.character
    character.charData = JSON.stringify(character.charData)

    const updatedCharacter = await prisma.character.update({
      where: {
        id: req.body.character.id
      },
      data: {
        name: character.name,
        charData: character.charData
      }
    })

    updatedCharacter.charData = JSON.parse(updatedCharacter.charData)
    res.json({ updatedCharacter })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

// router.get('/created', authenticateToken, async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         id: req.user.id
//       },
//       include: {
//         games: {
//           include: {
//             players: true
//           }
//         }
//       }
//     })

//     const userGames = user.games
//     userGames.forEach(e => {
//       e.gameData = JSON.parse(e.gameData)
//     })

//     res.json({ userGames })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// })



// router.post('/update/players', authenticateToken, async (req, res) => {
//   console.log(req.body.game)
//   const players = req.body.game.players.map(player => { 
//     return { id: player.id }
//   })
//   console.log(players)

//   try {
//     const updatedGame = await prisma.game.update({
//       where: {
//         id: req.body.game.id
//       },
//       data: {
//         players: {
//           connect: players
//         }
//       },
//       include: {
//         players: {
//           select: {
//             id: true,
//             username:true,
//             userId: true
//           }
//         }
//       }
//     })
//     updatedGame.gameData = JSON.parse(updatedGame.gameData)
//     console.log("updatedGame", updatedGame)
//     res.json({ updatedGame })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// })

// router.post('/remove/player', authenticateToken, async (req, res) => {
//   console.log(req.body.game.players)
//   const players = req.body.game.players.map(player => { 
//     return { id: player.id }
//   })
//   console.log(players)

//   try {
//     const updatedGame = await prisma.game.update({
//       where: {
//         id: req.body.game.id
//       },
//       data: {
//         players: {
//           disconnect: players
//         }
//       },
//       include: {
//         players: {
//           select: {
//             id: true,
//             username:true,
//             userId: true
//           }
//         }
//       }
//     })
//     updatedGame.gameData = JSON.parse(updatedGame.gameData)
//     res.json({ updatedGame })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// })

router.post('/delete', authenticateToken, async (req, res) => {
  try {
    const deletedCharacter = await prisma.character.delete({
      where: {
        id: req.body.character.id
      },
    })

    res.json({ deletedCharacter })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

export default router