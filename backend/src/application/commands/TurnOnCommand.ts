import { Command } from "./types";
import { Device } from "../../domain/entities/Device";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";

export class TurnOnCommand implements Command {
  constructor(private device: Device, private ha: IHomeAssistantAPI) {}

  async execute() {
    return this.ha.callService("switch", "turn_on", {
      entity_id: this.device.id,
    });
  }
}
