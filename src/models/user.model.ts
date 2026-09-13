import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  nom: string;
  email: string;
  motDePasse: string;
  role: "ADMIN" | "PROPRIETAIRE";
  statut: "actif" | "suspendu";
  comparerMotDePasse(motDePasseSaisi: string): Promise<boolean>;
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
    statut: {
      type: String,
      enum: ["actif", "suspendu"],
      default: "actif",
    },
  },
  { timestamps: true },
);

// Hachage automatique du mot de passe avant enregistrement
userSchema.pre("save", async function (next) {
  if (!this.isModified("motDePasse")) return;
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Méthode d'instance pour comparer les mots de passe lors du Login
userSchema.methods.comparerMotDePasse = async function (
  motDePasseSaisi: string,
): Promise<boolean> {
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

export default model<IUser>("User", userSchema);
