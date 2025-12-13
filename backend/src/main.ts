import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "./config/config";
import deviceRoutes from "./api/routes/deviceRoutes";
import healthRoutes from "./api/routes/healthRoutes";
import { HomeAssistantClient } from "./infrastructure/ha/HomeAssistantClient";
import { cacheService } from "./application/services/CacheService";
import { RedisCache } from "./infrastructure/cache/RedisCache";
import { logger } from "./infrastructure/logger";
import { SyncHADevicesUseCase } from "./application/usecases/SyncHADevicesUseCase";
import { DeviceMonitorService } from "./application/services/DeviceMonitorService";
import { DeviceRegistry } from "./application/services/DeviceRegistry";
import { authMiddleware } from "./api/middlewares/authMiddleware";
import { initWebSocketServer } from "./api/ws/WebSocketServer";
import { InMemoryDeviceRepository } from "./infrastructure/db/InMemoryDeviceRepository";

export const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/health", healthRoutes);

let server: http.Server;

export const startServer = async () => {

  if (config.env === "production") {
    app.use("/devices", authMiddleware, deviceRoutes);
  } else {
    app.use("/devices", deviceRoutes);
  }

  // Redis cache
  if (config.redisUrl) {
    const r = new RedisCache(config.redisUrl);
    await r.connect();
    cacheService.setCacheAdapter(r);
  }

  await DeviceRegistry.init();

  const haClient = new HomeAssistantClient(config.haUrl, config.haToken);
  await haClient.connect();

  // ✅ Repository inyectado correctamente
  const deviceRepository = new InMemoryDeviceRepository();

  const sync = new SyncHADevicesUseCase(haClient, deviceRepository);
  await sync.execute();

  const monitor = new DeviceMonitorService(DeviceRegistry, haClient);
  monitor.start();

  server = http.createServer(app);

  if (config.enableWs) {
    initWebSocketServer(server);
  }

  server.listen(config.port, () =>
    logger.info(`Server running on ${config.port}`)
  );

  return server;
};

if (require.main === module) startServer();
export { server };
