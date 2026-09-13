import mqtt from "mqtt";
import deviceModel from "../models/device.model";
import telemetryModel from "../models/telemetry.model";
import alertModel from "../models/alert.model";

export const initMQTT = (): void => {
  const brokerUrl =
    process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com:1883";
  const client = mqtt.connect(brokerUrl);

  client.on("connect", () => {
    console.log("[MQTT] Connecté au broker HiveMQ :", brokerUrl);
    client.subscribe("cameroun/tracker/+/telemetrie");
  });

  client.on("message", async (topic, message) => {
    try {
      const rawPayload = message.toString();
      console.log(`[MQTT] Payload brut reçu sur ${topic} :`, rawPayload);

      const payload = JSON.parse(rawPayload);
      const trackerId = topic.split("/")[2];

      const latitude = Number(payload.latitude ?? payload.lat);
      const longitude = Number(payload.longitude ?? payload.lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(`[MQTT] Trame ignorée : Coordonnées GPS invalides.`);
        return;
      }

      const device = await deviceModel.findOne({ trackerId });
      if (!device) {
        console.warn(
          `[MQTT] Trame ignorée : Le traceur "${trackerId}" n'est pas enregistré.`,
        );
        return;
      }

      const vitesse = Number(
        payload.vitesse ?? payload.speed ?? payload.vit ?? 0,
      );
      const audioFile = payload.son ?? payload.audio ?? "";

      // 1. Sauvegarde de la télémétrie
      await telemetryModel.create({
        device: device._id,
        latitude,
        longitude,
        vitesse,
        son: audioFile,
      });

      console.log(
        `[MQTT] Relevé enregistré pour le traceur ${trackerId} (Audio: ${audioFile || "aucun"})`,
      );

      // 2. Détection d'alerte : Vitesse excessive (> 80 km/h)
      if (vitesse > 80) {
        await alertModel.create({
          device: device._id,
          type: "VITESSE_EXCESSIVE",
          message: `Vitesse excessive détectée : ${vitesse} km/h par le traceur ${trackerId}`,
          niveau: "CRITICAL",
        });
        console.log(`[ALERTE] Vitesse excessive enregistrée pour ${trackerId}`);
      }

      // 3. Détection d'alerte : Événement Sonore / Audio
      if (audioFile && audioFile !== "") {
        await alertModel.create({
          device: device._id,
          type: "ANOMALIE_SONORE",
          message: `Capture sonore enregistrée (${audioFile}) sur le traceur ${trackerId}`,
          niveau: "INFO",
        });
        console.log(`[ALERTE] Capture sonore enregistrée pour ${trackerId}`);
      }
    } catch (error) {
      console.error("[MQTT] Erreur lors du traitement du message :", error);
    }
  });
};
