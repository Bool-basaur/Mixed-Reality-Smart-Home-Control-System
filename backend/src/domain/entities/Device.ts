import { CapabilityStrategy } from "../capabilities/CapabilityStrategy";

export abstract class Device {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly domain: string,
    public readonly capabilities: CapabilityStrategy[],
    public state: Record<string, any> = {}
  ) {}

  abstract updateFromHA(newState: any): void;

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      domain: this.domain,
      state: this.state,
      capabilities: this.capabilities.map(c => c.name)
    };
  }

}
