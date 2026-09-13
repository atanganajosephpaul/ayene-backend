import { Schema, model, Document, Types } from "mongoose";

export interface IDevice extends Document {
  trackerId: string;
  nom: string;
  proprietaire: Types.ObjectId;
  statut: "actif" | "inactif";
}

const deviceSchema = new Schema<IDevice>(
  {
    trackerId: { type: String, required: true, unique: true, trim: true },
    nom: { type: String, required: true, trim: true },
    proprietaire: { type: Schema.Types.ObjectId, ref: "User", required: true },
    statut: { type: String, enum: ["actif", "inactif"], default: "actif" },
  },
  { timestamps: true },
);

export default model<IDevice>("Device", deviceSchema);
