import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
    userId: string;
    category: string;
    limit: number;
    spent: number;
    currency: string;
}

const BudgetSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true },
    spent: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Ensure unique budget per category per user
BudgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', BudgetSchema);