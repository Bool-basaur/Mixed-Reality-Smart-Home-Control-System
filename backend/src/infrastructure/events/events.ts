import { EventEmitter } from "events";

export const EventBus = new EventEmitter();

export const EVENTS = {
  ENTITY_ADDED: "ENTITY_ADDED",
  ENTITY_REMOVED: "ENTITY_REMOVED",
  ENTITY_STATE_UPDATED: "ENTITY_STATE_UPDATED",
};
