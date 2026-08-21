import { Request, Response } from "express";
import { IoTEntity } from "../../domain/entities/IoTEntity";
import { listEntitiesUseCase, executeActionUseCase } from "../../application/usecases";

import { EntityRegistry} from "../../application/services";

export const listEntities = async (_req: Request, res: Response) => {

  const entities =
    await listEntitiesUseCase.execute();

  return res.json(
    entities.map(
      entity => entity.toJSON()
    )
  );
};

export const getEntity = (req: Request, res: Response) => {

  const entity =
    getEntityFromRequest(
      req,
      res
    );

  if (!entity) {
    return;
  }

  return res.json(
    entity.toJSON()
  );
};

export const getEntityState = (req: Request, res: Response) => {

  const entity =
    getEntityFromRequest(
      req,
      res
    );

  if (!entity) {
    return;
  }

  return res.json(
    entity.state
  );
};

export const getEntityAttributes = (req: Request, res: Response) => {

  const entity = getEntityFromRequest(req, res);

  if (!entity) {
    return;
  }

  return res.json(
    entity.attributes
  );
};

export const getEntityCapabilities = (
  req: Request,
  res: Response
) => {

  const entity =
    getEntityFromRequest(
      req,
      res
    );

  if (!entity) {
    return;
  }

  return res.json(
    entity.capabilities.map(
      capability => capability.name
    )
  );
};

export const getEntityActions = (
  req: Request,
  res: Response
) => {

  const entity =
    getEntityFromRequest(
      req,
      res
    );

  if (!entity) {
    return;
  }

  return res.json(
    entity.actions
  );
};

export const getEntityRelations = (
  req: Request,
  res: Response
) => {

  const entity =
    getEntityFromRequest(
      req,
      res
    );

  if (!entity) {
    return;
  }

  return res.json(
    entity.relations
  );
};

export const getEntityCount = (
  _req: Request,
  res: Response
) => {

  return res.json({
    count: EntityRegistry.count()
  });
};


export const executeAction = async (req: Request, res: Response) => {

    const entityId = req.params.entityId;
    const action = req.params.action;
    if (!entityId) {
      return res.status(400).json({error: "Missing entityId"});
    }
    if (!action) {
      return res.status(400).json({error: "Missing action"});
    }

    const result = await executeActionUseCase.execute(entityId,action,req.body);

    if (!result.ok) {
      return res.status(400).json({error: result.error});
    }

    return res.json({ok: true});
};



function getEntityFromRequest(req: Request,res: Response): IoTEntity | null {

  const id = req.params.id;

  if (!id) {
    res.status(400).json({
      error: "Missing id"
    });

    return null;
  }

  const entity = EntityRegistry.getById(id);

  if (!entity) {
    res.status(404).json({
      error: "Not found"
    });

    return null;
  }

  return entity;
}

