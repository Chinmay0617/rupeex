import express from 'express';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/budgets
// @desc    Get all budgets for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.json(budgets);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/budgets
// @desc    Add or update a budget
// @access  Private
router.post('/', auth, async (req, res) => {
    const { category, limit, currency } = req.body;

    try {
        let budget = await Budget.findOne({ userId: req.user.id, category });

        if (budget) {
            // Update
            budget.limit = limit;
            budget.currency = currency;
            await budget.save();
            return res.json(budget);
        }

        // Create
        const newBudget = new Budget({
            userId: req.user.id,
            category,
            limit,
            currency
        });

        budget = await newBudget.save();
        res.json(budget);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) return res.status(404).json({ msg: 'Budget not found' });

        // Make sure user owns budget
        if (budget.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Budget.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Budget removed' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;