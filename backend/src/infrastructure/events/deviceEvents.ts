import {
  EventBus,
  EVENTS
} from "../../infrastructure/events/events";

import { logger } from "../logger";

EventBus.on(
  EVENTS.ENTITY_ADDED,
  entity => {
    logger.info("Entity added", {id: entity.id});
  }
);

EventBus.on(
  EVENTS.ENTITY_STATE_UPDATED,
  entity => {
    logger.info("Entity updated", {id: entity.id});
  }
);

EventBus.on(
  EVENTS.ENTITY_REMOVED,
  (id: string) => {
    logger.info("Entity removed",{id});
  }
);