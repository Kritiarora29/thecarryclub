import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  name: string;
  text: string;
  stars: number;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    text: { type: String, required: true },
    stars: { type: Number, required: true, default: 5 },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
