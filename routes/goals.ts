import express from 'express';
import SavingsGoal from '../models/SavingsGoal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET all goals
router.get('/', auth, async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ userId: req.user.id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST create goal
router.post('/', auth, async (req, res) => {
    try {
        const goal = new SavingsGoal({
            ...req.body,
            userId: req.user.id,
        });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT update goal
router.put('/:id', auth, async (req, res) => {
    try {
        const goal = await SavingsGoal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE goal
router.delete('/:id', auth, async (req, res) => {
    try {
        const goal = await SavingsGoal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
