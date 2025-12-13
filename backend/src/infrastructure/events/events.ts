import { EventEmitter } from "events";

export const EventBus = new EventEmitter();

export const EVENTS = {
  DEVICE_ADDED: "DEVICE_ADDED",
  DEVICE_REMOVED: "DEVICE_REMOVED",
  DEVICE_STATE_UPDATED: "DEVICE_STATE_UPDATED",
};
