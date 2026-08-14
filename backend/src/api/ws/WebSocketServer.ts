import { Server } from "http";
import WebSocket from "ws";
import { EntityRegistry } from "../../application/services";
import { logger } from "../../infrastructure/logger";
import {EventBus, EVENTS} from "../../infrastructure/events/events";

let wss: WebSocket.Server | null = null;

export const initWebSocketServer = (server: Server) => {
  if (wss) return;

  wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    logger.info("WS client connected");

    ws.send(JSON.stringify({
        type: "entities",
        payload: EntityRegistry
          .getAll()
          .map(entity =>
            entity.toJSON()
          )
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
  
  EventBus.on(EVENTS.ENTITY_ADDED,
    entity => {
      broadcast("entity_added", entity.toJSON());
      logger.info("Entity added", { id: entity.id });
    }
  );

  EventBus.on(EVENTS.ENTITY_STATE_UPDATED,
    entity => {
      broadcast("entity_updated", entity.toJSON());
      logger.info("Entity updated", { id: entity.id });
    }
  );

  EventBus.on(EVENTS.ENTITY_REMOVED, id => {
    broadcast("entity_removed", { id });
    logger.info("Entity removed", { id });
  }
  );
}

const broadcast = (type: string, payload: unknown) => {
  if (wss) {
    const message = JSON.stringify({type, payload});

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
};

export const closeWebSocketServer = () => {
  if (wss) {
    wss.close();
    wss = null;
  }
};
