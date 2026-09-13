import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { initMQTT } from "./services/mqtt.service";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Démarrage de l'écoute du broker HiveMQ
  initMQTT();

  app.listen(PORT, () => {
    console.log(`[Serveur] Démarré avec succès sur http://localhost:${PORT}`);
  });
});
