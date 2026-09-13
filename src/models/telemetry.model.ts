import { Schema, model, Document, Types } from "mongoose";

export interface ITelemetry extends Document {
  device: Types.ObjectId;
  latitude: number;
  longitude: number;
  vitesse?: number;
  son?: string;
}

const telemetrySchema = new Schema<ITelemetry>(
  {
    device: { type: Schema.Types.ObjectId, ref: "Device", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    vitesse: { type: Number, default: 0 },
    son: { type: String },
  },
  { timestamps: true },
);

export default model<ITelemetry>("Telemetry", telemetrySchema);
