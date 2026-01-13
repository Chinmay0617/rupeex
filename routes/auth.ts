
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.status(201).json({ token, user: { userId: newUser.id, email: newUser.email, baseCurrency: newUser.baseCurrency } });
      }
    );
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.status(200).json({ token, user: { userId: user.id, email: user.email, baseCurrency: user.baseCurrency } });
      }
    );
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Google Auth
router.post('/google', async (req, res) => {
  const { token } = req.body;
  let email, googleId;

  try {
    // Try as ID Token
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (payload) {
        email = payload.email;
        googleId = payload.sub;
      }
    } catch (verifyError) {
      // If ID token verification fails, try as Access Token
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        email = userInfo.data.email;
        googleId = userInfo.data.sub;
      } catch (userInfoError) {
        throw new Error('Invalid Token');
      }
    }

    if (!email || !googleId) {
      return res.status(400).json({ msg: 'Email or Google ID not found in Token' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = new User({ email, googleId });
      await user.save();
    }

    const jwtPayload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        res.status(200).json({ token, user: { userId: user.id, email: user.email, baseCurrency: user.baseCurrency } });
      }
    );
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ msg: 'Server error during Google Auth' });
  }
});

export default router;
