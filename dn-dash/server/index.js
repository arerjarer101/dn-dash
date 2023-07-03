import express from 'express'
import cors from 'cors'
import prisma from '../prisma/prisma.js';
import users from './users.js'
import auth from './auth.js'


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// const cors = require('cors')

const port = 7070;
const hostname = 'localhost';

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/users', users)
app.use('/auth', auth)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})