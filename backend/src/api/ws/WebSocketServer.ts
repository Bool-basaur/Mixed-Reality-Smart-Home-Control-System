import { Server } from "http";
import WebSocket from "ws";
import { DeviceRegistry } from "../../application/services";
import { logger } from "../../infrastructure/logger";

let wss: WebSocket.Server | null = null;

export const initWebSocketServer = (server: Server) => {
  if (wss) return;

  wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    logger.info("WS client connected");

    ws.send(
      JSON.stringify({
        type: "devices",
        payload: DeviceRegistry.getAll().map((d) => d.toJSON())
      })
    );

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());
        logger.info("WS received", data);
      } catch (err) {
        logger.error("Invalid WS message", err);
      }
    });
  });

  DeviceRegistry.on("device_updated", (device) => {
    if (!wss) return;

    const payload = JSON.stringify({
      type: "device_update",
      payload: device.toJSON()
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });

    logger.info("Device updated", { id: device.id });
  });

  logger.info("WS Server initialized at /ws");
};

export const closeWebSocketServer = () => {
  if (wss) {
    wss.close();
    wss = null;
  }
};
