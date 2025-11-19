import { Router } from "express";
import { listDevices, getDevice } from "../controllers/DeviceController";

const router = Router();

router.get("/", listDevices);

router.get("/:id", getDevice);

export default router;
