
import express from 'express';
import SavingsGoal from '../models/SavingsGoal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/savings-goals
// @desc    Get all savings goals for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ userId: req.user.id });
        res.json(goals);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/savings-goals
// @desc    Add or update a savings goal
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, target, current, currency, deadline } = req.body;

    try {
        let goal = await SavingsGoal.findOne({ userId: req.user.id, name });

        if (goal) {
            // Update
            goal.target = target;
            goal.current = current;
            goal.currency = currency;
            goal.deadline = deadline;
            await goal.save();
            return res.json(goal);
        }

        // Create
        const newGoal = new SavingsGoal({
            userId: req.user.id,
            name,
            target,
            current,
            currency,
            deadline
        });

        goal = await newGoal.save();
        res.json(goal);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/savings-goals/:id
// @desc    Delete a savings goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let goal = await SavingsGoal.findById(req.params.id);

        if (!goal) return res.status(404).json({ msg: 'Savings goal not found' });

        // Make sure user owns goal
        if (goal.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await SavingsGoal.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Savings goal removed' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
