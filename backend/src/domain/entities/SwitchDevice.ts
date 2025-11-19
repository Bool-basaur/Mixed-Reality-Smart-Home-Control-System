import { Device } from "./Device";
export class SwitchDevice extends Device {
  updateFromHA(newState: any) {
    this.state = { ...this.state, ...newState.attributes, state: newState.state };
  }
}
