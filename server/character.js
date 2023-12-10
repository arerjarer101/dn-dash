import express from 'express'
import service from './service/service.js';
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

router.post('/transfer/items', authenticateToken, async (req, res) => {
  try {
    const itemsToTransfer = req.body.data.items
    console.log('req.body.data', req.body.data)

    const currentGame = await prisma.game.findUnique({
      where: {
        id: req.body.data.currentGameId
      },
      include: {
        characters: true,
      }
    })
    if (req.body.data.creatorId !== currentGame.creatorId) throw({message: 'bad request'})
    console.log('currentGame',currentGame)

    let sourceCharacter = {}
    let targetCharacter = {}
    currentGame.characters.forEach(e => {
      if (e.id === req.body.data.sourceId) sourceCharacter = e
      if (e.id === req.body.data.targetId) targetCharacter = e
    })
    console.log('sourceCharacter',sourceCharacter)
    console.log('targetCharacter',targetCharacter)
    sourceCharacter.charData = JSON.parse(sourceCharacter.charData)
    targetCharacter.charData = JSON.parse(targetCharacter.charData)
    const {
      allowTransfer, 
      updatedSourceItems, 
      updatedTargetItems
    } = service.transferItems(sourceCharacter.charData.items, itemsToTransfer, targetCharacter.charData.items)
    
    console.log('result', allowTransfer, updatedSourceItems, updatedTargetItems)
    if (!allowTransfer) throw({message: 'bad request'})
    sourceCharacter.charData.items = updatedSourceItems
    targetCharacter.charData.items = updatedTargetItems
    
    const updatedSourceCharacter = await prisma.character.update({
      where: {
        id: sourceCharacter.id
      },
      data: {
        charData: JSON.stringify(sourceCharacter.charData)
      }
    })
    const updatedTargetCharacter = await prisma.character.update({
      where: {
        id: targetCharacter.id
      },
      data: {
        charData: JSON.stringify(targetCharacter.charData)
      }
    })
    // updatedCharacter.charData = JSON.parse(updatedCharacter.charData)
    res.json({ source: updatedSourceCharacter, target: updatedTargetCharacter })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

router.post('/transfer/shared', authenticateToken, async (req, res) => {
  try {
    const itemsToTransfer = req.body.data.items
    console.log('req.body.data', req.body.data)

    const currentGame = await prisma.game.findUnique({
      where: {
        id: req.body.data.currentGameId
      },
      include: {
        characters: true,
      }
    })
    if (req.body.data.creatorId !== currentGame.creatorId) throw({message: 'bad request'})
    console.log('currentGame',currentGame)

    let sourceCharacter = {}
    let targetCharacter = {}
    currentGame.characters.forEach(e => {
      if (e.id === req.body.data.sourceId) sourceCharacter = e
      if (e.id === req.body.data.targetId) targetCharacter = e
    })
    console.log('sourceCharacter',sourceCharacter)
    console.log('targetCharacter',targetCharacter)
    sourceCharacter.charData = JSON.parse(sourceCharacter.charData)
    targetCharacter.charData = JSON.parse(targetCharacter.charData)
    const {
      allowTransfer, 
      updatedSourceItems, 
      updatedTargetItems
    } = service.transferItems(sourceCharacter.charData.items, itemsToTransfer, targetCharacter.charData.items)
    
    console.log('result', allowTransfer, updatedSourceItems, updatedTargetItems)
    if (!allowTransfer) throw({message: 'bad request'})
    sourceCharacter.charData.items = updatedSourceItems
    targetCharacter.charData.items = updatedTargetItems
    
    const updatedSourceCharacter = await prisma.character.update({
      where: {
        id: sourceCharacter.id
      },
      data: {
        charData: JSON.stringify(sourceCharacter.charData)
      }
    })
    const updatedTargetCharacter = await prisma.character.update({
      where: {
        id: targetCharacter.id
      },
      data: {
        charData: JSON.stringify(targetCharacter.charData)
      }
    })
    // updatedCharacter.charData = JSON.parse(updatedCharacter.charData)
    res.json({ source:updatedSourceCharacter, target:updatedTargetCharacter })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

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