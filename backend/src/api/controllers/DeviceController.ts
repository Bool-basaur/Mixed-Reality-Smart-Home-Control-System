import { Request, Response } from "express";
import { listDevicesUseCase } from "../../application/usecases/ListDevicesUseCase";
import { deviceService } from "../../application/services/DeviceService";
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
  const { id, action } = req.params;
  if (!id || !action) {
    return res.status(400).json({ error: "Missing id or action" });
  }

  const result = await deviceService.executeAction(id, action, req.body);

  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ ok: true });
};
