import express from 'express'
import prisma from '../prisma/prisma.js'
import { v4 as uuidv4 } from 'uuid'

// import dotenv from 'dotenv';
// dotenv.config();
// const dev = process.env.NODE_ENV === 'development'

const router = express.Router()


// get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    console.log('users: ', users)
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

  // res.send('This is  Users!')
});

// create a user
router.post("/create", async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    const id = uuidv4()
    const newUser = await prisma.user.create({
      data: {
        userId: id,
        email,
        username,
        password,
      },
    });
    res.json(newUser);
  } catch (error) {
    // res.status(500).json({ error: 'Internal server error' });
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get a user by id
router.get("/users/:id", async (req, res, next) => {});

// update a post
router.patch("/users", async (req, res, next) => {});

// delete a post
router.delete("/delete", async (req, res, next) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        userId: req.body.userId
      }
    })
    res.json(deleteUser)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

// get a user's participated games
router.get("/users/:id/participated", async (req, res, next) => {});

// get a user's created games
router.get("/users/:id/created", async (req, res, next) => {});

export default router