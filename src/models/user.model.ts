import { Schema, model } from "mongoose";

export interface IUser {
  nom: string;
  email: string;
  motDePasse: string;
  role: "ADMIN" | "PROPRIETAIRE";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "PROPRIETAIRE"],
      default: "PROPRIETAIRE",
    },
  },
  { timestamps: true },
);

export default model<IUser>("User", userSchema);
