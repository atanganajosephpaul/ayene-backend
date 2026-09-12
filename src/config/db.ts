import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/ayene_db",
    );
    console.log(`[MongoDB] Connecté à : ${conn.connection.host}`);
  } catch (error) {
    console.error("[MongoDB] Erreur de connexion :", error);
    process.exit(1);
  }
};
