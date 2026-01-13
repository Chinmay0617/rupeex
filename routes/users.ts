import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @route   POST api/users/reset-password
// @desc    Reset user password (simplified for development)
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ msg: 'Please provide email and new password' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // The user model pre-save hook will handle hashing
        user.password = newPassword;
        await user.save();

        res.json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;
