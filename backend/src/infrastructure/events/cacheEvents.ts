import {
  EventBus,
  EVENTS
} from "./events";

import { cacheService }
  from "../../application/services/CacheService";

EventBus.on(
  EVENTS.ENTITY_ADDED,
  async entity => {

    await cacheService.set(
      `entity:${entity.id}`,
      entity
    );
  }
);

EventBus.on(
  EVENTS.ENTITY_STATE_UPDATED,
  async entity => {

    await cacheService.set(
      `entity:${entity.id}`,
      entity
    );
  }
);

EventBus.on(
  EVENTS.ENTITY_REMOVED,
  async id => {

    await cacheService.delete(
      `entity:${id}`
    );
  }
);