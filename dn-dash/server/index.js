import express from 'express'
import cors from 'cors'
import prisma from '../prisma/prisma.js'
import token from './token.js'
import { authenticateToken, generateAccessToken } from './token.js'
import user from './user.js'
import auth from './auth.js'
import dotenv from 'dotenv'

dotenv.config();

// const cors = require('cors')
const port = 7070;
const hostname = '10.100.102.5'

const app = express()


app.use(cors(
  {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization']
  }
))
// app.all('*', function (req, res) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   //...
//  });
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/user', user)
app.use('/auth', auth)
app.use('/token', token)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.get('/userId', authenticateToken, (req, res) => {

//   console.log('req.user.userId', req.user.userId)

//   const userId = req.user.userId

//   res.json(userId)
// })

// app.get('/decoded', authenticateToken, (req, res) => {

//   console.log('req.decoded', req.decoded)

//   const decoded = req.decoded

//   res.json(decoded)
// })

// app.post('/login', async (req, res) => {
//   try {
//     if (!req.body.username) throw new Error('Incorrect username or password')
//     const user = await prisma.user.findUnique({
//       where: {
//         username: req.body.username
//       }
//     });
//     if (req.body.password !== user.password) throw new Error('Incorrect username or password')

//     console.log('user logged in ', user)
//     const accessToken = generateAccessToken(user)
//     const refreshToken = jwt.sign({user, createdAt: Date.now()}, process.env.REFRESH_TOKEN_SECRET)
//     const userId = user.userId

//     await prisma.RefreshTokens.create({ data: { token: refreshToken, userId: userId } }).then(

//     )
//     delete user.userId
//     delete user.password
//     delete user.id

//     console.log(user)
//     console.log(user.password)

//     res.json({ accessToken: accessToken, refreshToken: refreshToken, user: {
//         email: user.email,
//         username: user.username,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// })

// app.post('/register', async (req, res) => {
//   try {
//     const { email, username, password } = req.body;

//     if (!password || !username) throw new Error('incorrect password! ')
//     const alreadyExists = await prisma.user.findUnique({
//       where: {
//         username: username
//       }
//     })
//     if (alreadyExists) throw new Error('User already exists')

//     const id = uuidv4()
//     const newUser = await prisma.user.create({
//       data: {
//         userId: id,
//         email,
//         username,
//         password,
//       },
//     });

//     console.log('user created ', newUser)
//     const accessToken = generateAccessToken(newUser)
//     const refreshToken = jwt.sign({newUser, createdAt: Date.now()}, process.env.REFRESH_TOKEN_SECRET)
//     const userId = newUser.userId

//     await prisma.RefreshTokens.create({ data: { token: refreshToken, userId: userId } })

//     res.json({ 
//       accessToken: accessToken,
//       refreshToken: refreshToken, 
//       user: {
//         username: newUser.username,
//         email: newUser.email,
//         games: newUser.games,
//         characters: newUser.characters,
//         participatedGames: newUser.participatedGames
//       } 
//     })
//   } catch (error) {
//     console.log(error.message)
//     if (error.message === 'incorrect password!') res.status(500).json({ error: 'incorrect password!' });
//     else res.status(500).json({ error: error.message });
//   }
// })

// app.post('/refresh', async (req, res) => {
//   const refreshToken = req.body.token
//   if (refreshToken == null) res.sendStatus(401)

//   const existingToken = await prisma.RefreshTokens.findUnique({
//     where: {
//       token: refreshToken
//     }
//   })

//   if (!existingToken) return res.sendStatus(403)

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//     if (err) return res.sendStatus(403)
//     console.log('refresh token decoded', decoded)
//     const accessToken = generateAccessToken(decoded.user)
//     res.json({ accessToken: accessToken })
//   })
// })

// app.post('/update', authenticateToken, async (req, res) => {
//   try {
//     const newdata = req.body.newdata
//     if (!newdata.username || !newdata.oldpassword) throw new Error('Necessary fields cannot be empty')
//     console.log('req.body:',req.body)
//     const user = await prisma.user.findUnique({
//       where: {
//         username: req.user.username
//       }
//     });
//     if (newdata.oldpassword !== user.password) throw new Error('Incorrect password')
//     const alreadyExists = await prisma.user.findUnique({
//       where: {
//         username: newdata.username
//       }
//     })
//     if (alreadyExists && alreadyExists.username !== req.user.username) throw new Error('User already exists')
    

//     const updatedUser = await prisma.user.update({
//       where: {
//         username: req.user.username
//       },
//       data: {
//         username: newdata.username,
//         password: newdata.newpassword ? newdata.newpassword : newdata.oldpassword,
//         email: newdata.email
//       }
//     })

//     console.log(Object.keys(newdata))
//     console.log(Object.keys(updatedUser))

//     console.log('user updated ', updatedUser)
//     delete updatedUser.userId
//     delete updatedUser.password
//     delete updatedUser.id
//     res.json({ user: {
//         email: updatedUser.email,
//         username: updatedUser.username,
//         updatedAt: updatedUser.updatedAt
//       }
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// })

// app.delete('/logout', authenticateToken, async (req, res) => {
//   try {
//     console.log(req.body)
//     const deleteToken = await prisma.RefreshTokens.delete({
//       where: {
//         token: req.body.token
//       }
//     })
//     res.json(deleteToken)
//     // res.sendStatus(204)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Internal server error' });
//   }
// })

// app.delete('/logoutAll', authenticateToken, async (req, res) => {
//   try {
//     const deleteToken = await prisma.RefreshTokens.deleteMany({
//       where: {
//         userId: req.user.userId
//       }
//     })
//     res.json(deleteToken)
//     // res.sendStatus(204)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Internal server error' });
//   }
// })

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})