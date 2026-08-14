import { Router } from "express";
import { getSnapshot } from "../controllers/SnapshotController";

const router = Router();

router.get("/", getSnapshot);

export default router;