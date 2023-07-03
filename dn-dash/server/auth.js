import express from 'express'
import prisma from '../prisma/prisma.js';
import { v4 as uuidv4 } from 'uuid';

// import dotenv from 'dotenv';
// dotenv.config();
// const dev = process.env.NODE_ENV === 'development';

const router = express.Router();

// create a user
router.post("/register", async (req, res, next) => {
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
    console.log(error)
    // res.status(500).json({ error: 'Internal server error' });
    if (error.code === "P2002") res.status(500).json({error: 'User with this name already exists!'});
    else res.status(500).json({ error: 'Internal server error' });
  }
});

export default router