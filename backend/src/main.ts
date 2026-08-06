import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "./config/config";
import deviceRoutes from "./api/routes/deviceRoutes";
import healthRoutes from "./api/routes/healthRoutes";
import { HomeAssistantClient } from "./infrastructure/ha/HomeAssistantClient";
import { MockHomeAssistantClient } from "./infrastructure/ha/MockHomeAssistantClient";
import { cacheService } from "./application/services/CacheService";
import { RedisCache } from "./infrastructure/cache/RedisCache";
import { logger } from "./infrastructure/logger";
import { SyncHADevicesUseCase } from "./application/usecases/SyncHADevicesUseCase";
import { DeviceMonitorService } from "./application/services/DeviceMonitorService";
import { DeviceRegistry } from "./application/services";
import { authMiddleware } from "./api/middlewares/authMiddleware";
import { initWebSocketServer } from "./api/ws/WebSocketServer";
import { InMemoryDeviceRepository } from "./infrastructure/storage/InMemoryDeviceRepository";
import { repoMock } from "./infrastructure/storage/repoMock";

export const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/health", healthRoutes);

let server: http.Server;

export const startServer = async () => {
  /* ---------------- ROUTES ---------------- */

  if (config.env === "production") {
    app.use("/devices", authMiddleware, deviceRoutes);
  } else {
    app.use("/devices", deviceRoutes);
  }

  // ---------------- CACHE / REDIS ---------------- 

  if (config.redisUrl && config.redisUrl.trim() !== "") {
    const r = new RedisCache(config.redisUrl);
    try {
      await r.connect();
      cacheService.setCacheAdapter(r);
    } catch (err) {
      logger.warn("Redis not available, continuing without cache");
    }
  } else {
    logger.info("Redis disabled (no REDIS_URL provided)");
  }


  // ---------------- REGISTRY ---------------- 

  await DeviceRegistry.init();

  // ---------------- DATA SOURCE SELECTION ---------------- 

  if (config.useMockData) {
    logger.info("Starting backend in MOCK mode");

    const haClient = new MockHomeAssistantClient();

    await haClient.connect();

    DeviceRegistry.setHA(haClient);

    const devices = await haClient.getAllEntities();

    devices.forEach((device) =>
      DeviceRegistry.addDevice(device)
    );

    const monitor = new DeviceMonitorService(
      DeviceRegistry,
      haClient as any
    );

    monitor.start();
} else {
    logger.info("Starting backend connected to Home Assistant");

    const haClient = new HomeAssistantClient(
      config.haUrl,
      config.haToken
    );

    await haClient.connect();
    DeviceRegistry.setHA(haClient);

    const deviceRepository = new InMemoryDeviceRepository();

    const sync = new SyncHADevicesUseCase(
      haClient,
      deviceRepository
    );

    await sync.execute();

    const monitor = new DeviceMonitorService(
      DeviceRegistry,
      haClient
    );

    monitor.start();
  }

  // ---------------- HTTP + WS ---------------- 

  server = http.createServer(app);

  if (config.enableWs) {
    initWebSocketServer(server);
  }

  server.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });

  return server;
};

// ---------------- BOOTSTRAP ----------------

if (require.main === module) {
  startServer();
}

export { server };
