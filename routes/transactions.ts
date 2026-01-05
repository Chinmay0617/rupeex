import express from 'express';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/transactions
// @desc    Add a new transaction
// @access  Private
router.post('/', auth, async (req, res) => {
    const { description, amount, type, category, date, currency, source, confidence, isEdited, aiGenerated, isRecurring, anomalyScore } = req.body;

    try {
        const newTransaction = new Transaction({
            userId: req.user.id,
            description,
            amount,
            type,
            category,
            date,
            currency,
            source,
            confidence,
            isEdited,
            aiGenerated,
            isRecurring,
            anomalyScore
        });

        const transaction = await newTransaction.save();
        res.json(transaction);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { description, amount, type, category, date, currency, source, confidence, isEdited, aiGenerated, isRecurring, anomalyScore } = req.body;

    // Build transaction object
    const transactionFields: any = {};
    if (description) transactionFields.description = description;
    if (amount) transactionFields.amount = amount;
    if (type) transactionFields.type = type;
    if (category) transactionFields.category = category;
    if (date) transactionFields.date = date;
    if (currency) transactionFields.currency = currency;
    if (source) transactionFields.source = source;
    if (confidence) transactionFields.confidence = confidence;
    if (isEdited) transactionFields.isEdited = isEdited;
    if (aiGenerated) transactionFields.aiGenerated = aiGenerated;
    if (isRecurring) transactionFields.isRecurring = isRecurring;
    if (anomalyScore) transactionFields.anomalyScore = anomalyScore;

    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

        // Make sure user owns transaction
        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { $set: transactionFields },
            { new: true }
        );

        res.json(transaction);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

        // Make sure user owns transaction
        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Transaction removed' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;