import { Device } from "./Device";

export class MediaPlayerDevice extends Device {
  updateFromHA(newState: any): void {
    this.state = { ...this.state, ...newState };
  }
}
