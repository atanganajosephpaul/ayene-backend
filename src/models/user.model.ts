import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  nom: string;
  email: string;
  motDePasse: string;
  role: "admin" | "utilisateur";
  statut: "actif" | "suspendu";
  comparerMotDePasse(motDePasseSaisi: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    motDePasse: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "utilisateur"],
      default: "utilisateur",
    },
    statut: {
      type: String,
      enum: ["actif", "suspendu"],
      default: "actif",
    },
  },
  {
    timestamps: true,
  },
);

// Middleware Mongoose avant la sauvegarde pour hacher le mot de passe
userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("motDePasse")) return;

  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// Méthode personnalisée pour comparer les mots de passe
userSchema.methods.comparerMotDePasse = async function (
  this: IUser,
  motDePasseSaisi: string,
): Promise<boolean> {
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

export default model<IUser>("User", userSchema);
