import { Request, Response } from "express";
import { getSpatialInformationUseCase, setSpatialInformationUseCase, getSpatialDigitalTwinUseCase, getAllSpatialDigitalTwinsUseCase, getUnconfiguredSpatialContextsUseCase} from "../../application/usecases";
import { SpatialInformation } from "../../domain/valueObjects/SpatialInformation";
import { getAllSpatialContextsUseCase, getSpatialContextUseCase }from "../../application/usecases";

export const getSpatialInformation = async (
  req: Request,
  res: Response
) => {

  const entityId = req.params.entityId;

  if (!entityId) {
    return res.status(400).json({error: "Missing entityId"});
  }

  const spatialInfo = await getSpatialInformationUseCase.execute(entityId);

  if (!spatialInfo) {
    return res.status(404).json({error: "Not found"});
  }

  return res.json(spatialInfo);
};

export const saveSpatialInformation = async (
  req: Request,
  res: Response
) => {

  const body = req.body;
  if (!body.entityId) {
    return res.status(400).json({error: "Missing entityId"});
  } 
  
  const spatialInfo = new SpatialInformation(body.entityId, body.homeId, body.roomId, body.zoneId, body.position, body.rotation);

  await setSpatialInformationUseCase.execute(spatialInfo);

  return res.json({ok: true});
};

export const getSpatialDigitalTwin = async (
  req: Request,
  res: Response
) => {

  const entityId =
    req.params.entityId;

  if (!entityId) {
    return res.status(400).json({error: "Missing entityId"});
  }

  const twin =
    await getSpatialDigitalTwinUseCase.execute(entityId);

  if (!twin) {
    return res.status(404).json({error: "Not found"});
  }

  return res.json(twin);
};

export const getAllSpatialDigitalTwins = async (
  _req: Request,
  res: Response
) => {

  const twins = await getAllSpatialDigitalTwinsUseCase.execute();

  return res.json(twins);
};

export const getAllSpatialContexts =
  async (
    _req: Request,
    res: Response
  ) => {

    const contexts = getAllSpatialContextsUseCase.execute();

    return res.json(contexts);
  };


export const getSpatialContext =
  async (req: Request, res: Response) => {

    const entityId = req.params.entityId;

    if (!entityId) {
      return res.status(400).json({error: "Missing entityId"});
    }

    const context = getSpatialContextUseCase.execute(entityId);

    if (!context) {
      return res.status(404).json({error: "Not found"});
    }

    return res.json(context);
  };

export const getUnconfiguredSpatialContexts = async (_req: Request, res: Response) => {
    const contexts = getUnconfiguredSpatialContextsUseCase.execute();
    return res.json(contexts);
};
