import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  sessionId: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ userId: 1, sessionId: 1, createdAt: 1 });

export default mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
