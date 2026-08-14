import { Request, Response } from "express";
import { EntityRegistry } from "../../application/services";
import { config } from "../../config/config";

export const healthController = {
  async check(_req: Request, res: Response) {
    const devices = EntityRegistry.getAll();

    res.json({
      status: "ok",
      uptime: process.uptime(),
      ha_connected: !!EntityRegistry.getHA(),
      redis: { connected: !!config.redisUrl },
      devices: { count: devices.length },
      timestamp: new Date().toISOString()
    });
  }
};