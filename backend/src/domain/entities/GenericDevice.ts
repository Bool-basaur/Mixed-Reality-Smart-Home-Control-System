import { Device } from "./Device";
export class GenericDevice extends Device {
  updateFromHA(newState: any) {
    this.state = { ...this.state, ...newState };
  }
}
