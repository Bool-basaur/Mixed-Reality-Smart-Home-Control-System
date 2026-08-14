import { Request, Response } from "express";
import { getSystemSnapshotUseCase} from "../../application/usecases";

export const getSnapshot = async (_req: Request, res: Response) => {
  const snapshot = getSystemSnapshotUseCase.execute();
  return res.json( snapshot);
};