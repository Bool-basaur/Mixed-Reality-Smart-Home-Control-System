import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

import { config } from "./config/config";

import entityRoutes from "./api/routes/entitiesRoutes";
import healthRoutes from "./api/routes/healthRoutes";
import spatialRoutes from "./api/routes/spatialRoutes";

import { HomeAssistantClient } from "./infrastructure/ha/HomeAssistantClient";
import { MockHomeAssistantClient } from "./infrastructure/ha/MockHomeAssistantClient";

import { cacheService } from "./application/services/CacheService";
import { RedisCache } from "./infrastructure/cache/RedisCache";

import { logger } from "./infrastructure/logger";

import { EntityMonitorService } from "./application/services/EntityMonitorService";
import { EntityRegistry } from "./application/services";

import { authMiddleware } from "./api/middlewares/authMiddleware";
import { initWebSocketServer } from "./api/ws/WebSocketServer";

import "./infrastructure/events";
export const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/health", healthRoutes);

let server: http.Server;

export const startServer = async () => {
  logger.info("START SERVER");

  /* ---------------- ROUTES ---------------- */

  if (config.env === "production") {
    app.use("/entities",
      authMiddleware,
      entityRoutes);

    app.use("/spatial",
      authMiddleware,
      spatialRoutes);

  } else {

    app.use("/entities",
      entityRoutes);

    app.use("/spatial",
      spatialRoutes);

  }

  /* ---------------- CACHE / REDIS ---------------- */

  if (config.redisUrl && config.redisUrl.trim() !== "") {
    const redisCache = new RedisCache(config.redisUrl);

    try {
      await redisCache.connect();

      cacheService.setCacheAdapter(
        redisCache
      );
    } catch {
      logger.warn(
        "Redis not available, continuing without cache"
      );
    }
  } else {
    logger.info(
      "Redis disabled (no REDIS_URL provided)"
    );
  }

  /* ---------------- REGISTRY ---------------- */

  await EntityRegistry.init();

  /* ---------------- DATA SOURCE SELECTION ---------------- */

  if (config.useMockData) {
    logger.info("Starting backend in MOCK mode");

    const haClient = new MockHomeAssistantClient();

    await haClient.connect();

    EntityRegistry.setHA(haClient);

    const haEntities = await haClient.getAllEntities();

    const devices = await haClient.getDeviceRegistry();

    const entityRegistry = await haClient.getEntityRegistry();

    logger.info(`[MOCK] Loaded ${haEntities.length} HA entities`);

    logger.info(`[MOCK] Loaded ${devices.length} devices`);

    logger.info(`[MOCK] Loaded ${entityRegistry.length} entity registry entries`);

    const monitor = new EntityMonitorService(EntityRegistry,haClient);

    monitor.start();
} else {
    logger.info("Starting backend connected to Home Assistant");

    const haClient = new HomeAssistantClient(config.haUrl, config.haToken);

    await haClient.connect();

    EntityRegistry.setHA(haClient);

    const monitor = new EntityMonitorService(EntityRegistry, haClient);

    monitor.start();
  }

  /* ---------------- HTTP + WS ---------------- */

  server = http.createServer(app);

  if (config.enableWs) {
    initWebSocketServer(server);
  }

  server.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });

  return server;
};

/* ---------------- BOOTSTRAP ---------------- */

if (require.main === module) {
  startServer();
}

export { server };