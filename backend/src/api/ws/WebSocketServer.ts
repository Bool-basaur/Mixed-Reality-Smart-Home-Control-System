import { Server } from "http";
import WebSocket from "ws";
import { DeviceRegistry } from "../../application/services/DeviceRegistry";

let wss: WebSocket.Server;

export const initWebSocketServer = (server: Server) => {
  wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("WS Client connected");

    // Enviar lista inicial de dispositivos
    ws.send(
      JSON.stringify({
        type: "devices",
        payload: DeviceRegistry.getAll().map((d) => d.toJSON())
      })
    );

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());
        console.log("WS received:", data);
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    });
  });

  // Suscripción a eventos de DeviceRegistry
  DeviceRegistry.on("device_updated", (device) => {
    const payload = JSON.stringify({
      type: "device_update",
      payload: device.toJSON()
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    });
  });

  console.log("WS Server initialized at /ws");
};
