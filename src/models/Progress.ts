import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  weight?: number;
  bmi?: number;
  caloriesConsumed?: number;
  waterIntake?: number; // ml
  notes?: string;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    weight: Number,
    bmi: Number,
    caloriesConsumed: Number,
    waterIntake: Number,
    notes: String,
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);
