import mongoose, { Schema, Document, Model } from "mongoose";

interface DropEntry {
  date: Date;
  status: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  drops: DropEntry[];
}

const DropSchema = new Schema<DropEntry>(
  {
    date: { type: Date, default: Date.now },
    status: { type: String, default: "registered" },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    drops: { type: [DropSchema], default: [] },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
