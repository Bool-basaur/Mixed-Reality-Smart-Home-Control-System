import { Request, Response } from "express";
import { listDevicesUseCase } from "../../application/usecases/ListDevicesUseCase";
import { deviceService } from "../../application/services/DeviceService";  // 👈 IMPORT CORRECTO

export const listDevices = async (_req: Request, res: Response) => {
  const list = await listDevicesUseCase.execute();
  res.json(list.map(d => d.toJSON()));
};

export const getDevice = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  
  const device = (await listDevicesUseCase.execute()).find(d => d.id === id);
  if (!device) return res.status(404).json({ error: "not found" });

  res.json(device.toJSON());
};

export const postAction = async (req: Request, res: Response) => {
  try {
    const result = await deviceService.executeAction(
      req.params.id !== undefined ? req.params.id : "", //TODO revisar esto
      req.params.action !== undefined ? req.params.action : "", //TODO revisar esto
      req.body
    );

    res.json({ ok: true, result });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
