import mongoose, { Schema, Document } from 'mongoose';

export interface ISavingsGoal extends Document {
    userId: string;
    name: string;
    target: number;
    current: number;
    currency: string;
    deadline?: string;
}

const SavingsGoalSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    target: { type: Number, required: true },
    current: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true },
    deadline: { type: String },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

export default mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema);