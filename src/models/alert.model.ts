import { Schema, model, Types } from "mongoose";

export interface IAlert {
  device: Types.ObjectId;
  type: "VITESSE_EXCESSIVE" | "ANOMALIE_SONORE" | "DECONNEXION" | "INFO";
  message: string;
  niveau: "INFO" | "WARNING" | "CRITICAL";
  lu: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    type: {
      type: String,
      enum: ["VITESSE_EXCESSIVE", "ANOMALIE_SONORE", "DECONNEXION", "INFO"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    niveau: {
      type: String,
      enum: ["INFO", "WARNING", "CRITICAL"],
      default: "WARNING",
    },
    lu: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default model<IAlert>("Alert", alertSchema);
