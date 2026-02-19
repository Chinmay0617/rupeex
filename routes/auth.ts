
import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/auth/me
// @desc    Get current user profile (synced with Clerk)
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Return in format expected by frontend
    res.json({
      user: {
        userId: user.id,
        email: user.email,
        baseCurrency: user.baseCurrency
      }
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: `Server Error in Auth Route: ${err.message}` });
  }
});

/*
// Legacy Login/Register routes (Disabled for Clerk Migration)
// ... (omitted for brevity)
*/

export default router;
