import { Device } from "./Device";
export class SensorDevice extends Device {
  updateFromHA(newState: any) {
    this.state = { ...this.state, attributes: newState.attributes, state: newState.state };
  }
}
