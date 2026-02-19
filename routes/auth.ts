
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[Auth] Registration attempt for: ${email}`);

  try {
    let user = await User.findOne({ email });

    if (user) {
      if (!user.password) {
        console.log(`[Auth] Legacy user found without password: ${email}. Setting password.`);
        user.password = password;
        await user.save();
      } else {
        console.log(`[Auth] Registration failed: User already exists - ${email}`);
        return res.status(400).json({ msg: 'User already exists' });
      }
    } else {
      console.log(`[Auth] Creating new user: ${email}`);
      user = new User({
        email,
        password,
      });
      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const JWT_SECRET = process.env.JWT_SECRET || "fallback_debug_secret_fintrack_2024";

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error("[Auth] JWT Sign Error:", err);
          return res.status(500).json({ msg: "Error generating token" });
        }
        console.log(`[Auth] Registration successful for: ${email}`);
        res.json({ token });
      }
    );
  } catch (err: any) {
    console.error(`[Auth] Registration Error for ${email}:`, err.message);
    res.status(500).json({ msg: 'Server error during registration', error: err.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[Auth] Login attempt for: ${email}`);

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log(`[Auth] Login failed: User not found - ${email}`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (!user.password) {
      console.log(`[Auth] Login failed: User has no password set - ${email}`);
      return res.status(400).json({ msg: 'Account exists but has no password. Please use "Sign Up" to set one.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`[Auth] Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const JWT_SECRET = process.env.JWT_SECRET || "fallback_debug_secret_fintrack_2024";

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error("[Auth] JWT Sign Error:", err);
          return res.status(500).json({ msg: "Error generating token" });
        }
        console.log(`[Auth] Login successful for: ${email}`);
        res.json({ token });
      }
    );
  } catch (err: any) {
    console.error(`[Auth] Login Error for ${email}:`, err.message);
    res.status(500).json({ msg: `Login Failed: ${err.message}` });
  }
});

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err: any) {
    console.error("GetProfile Error:", err);
    res.status(500).json({ msg: `GetProfile Failed: ${err.message}` });
  }
});

export default router;
