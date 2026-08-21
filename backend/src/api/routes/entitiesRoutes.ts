import { Router } from "express";

import {
  listEntities,
  getEntity,
  getEntityState,
  getEntityAttributes,
  getEntityCapabilities,
  getEntityActions,
  getEntityRelations,
  getEntityCount,
  executeAction
} from "../controllers/EntityController";

const router = Router();

router.get("/", listEntities);

router.get("/count", getEntityCount);

router.get("/:id", getEntity);

router.get("/:id/state", getEntityState);

router.get("/:id/attributes", getEntityAttributes);

router.get("/:id/relations", getEntityRelations);

router.get("/:id/capabilities", getEntityCapabilities);

router.get("/:id/actions", getEntityActions);

router.post("/:entityId/actions/:action", executeAction);

export default router;