import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: string;
    date: Date | string;
    amount: number;
    currency: string;
    description: string;
    category: string;
    type: 'INCOME' | 'EXPENSE';
    source: 'MANUAL' | 'AI_NLP' | 'AI_SCAN';
    confidence?: number;
    isEdited?: boolean;
    aiGenerated?: boolean;
    isRecurring?: boolean;
    anomalyScore?: number;
}

const TransactionSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    // Use Date type for better range queries
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, enum: ['INCOME', 'EXPENSE'] },
    source: { type: String, required: true, enum: ['MANUAL', 'AI_NLP', 'AI_SCAN'] },
    confidence: { type: Number },
    isEdited: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false },
    isRecurring: { type: Boolean, default: false },
    anomalyScore: { type: Number },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Compound index for fetching user transactions sorted by date
TransactionSchema.index({ userId: 1, date: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);