import { Router } from "express";

import {
  getSpatialInformation,
  saveSpatialInformation,
  getSpatialDigitalTwin,
  getAllSpatialDigitalTwins,
  getAllSpatialContexts,
  getSpatialContext,
  getUnconfiguredSpatialContexts
} from "../controllers/SpatialController";


const router = Router();

router.post(
  "/spatial-information",
  saveSpatialInformation
);

router.get(
  "/spatial-information/:entityId",
  getSpatialInformation
);

router.get(
  "/spatial-digital-twins",
  getAllSpatialDigitalTwins
);

router.get(
  "/spatial-digital-twins/:entityId",
  getSpatialDigitalTwin
);

router.get(
  "/spatial-contexts",
  getAllSpatialContexts
);

router.get(
  "/spatial-contexts/unconfigured",
  getUnconfiguredSpatialContexts
);

router.get(
  "/spatial-contexts/:entityId",
  getSpatialContext
);

export default router;