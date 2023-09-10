import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import token from './token.js'
import user from './user.js'
import auth from './auth.js'
import game from './game.js'

dotenv.config();
const port = 7070;
const hostname = '10.100.102.5'
const app = express()

app.use(cors(
  {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization']
  }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/user', user)
app.use('/auth', auth)
app.use('/token', token)
app.use('/game', game)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})