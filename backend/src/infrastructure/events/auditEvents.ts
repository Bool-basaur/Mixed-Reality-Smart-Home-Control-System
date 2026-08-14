import {
  EventBus,
  EVENTS
} from "./events";

import { logger } from "../logger";

EventBus.on(
  EVENTS.ENTITY_ADDED,
  entity => {
    logger.info(
      "[AUDIT] Entity added",
      { id: entity.id }
    );
  }
);

EventBus.on(
  EVENTS.ENTITY_REMOVED,
  id => {
    logger.info(
      "[AUDIT] Entity removed",
      { id }
    );
  }
);