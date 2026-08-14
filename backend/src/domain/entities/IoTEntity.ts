import { CapabilityStrategy } from "../capabilities/CapabilityStrategy";
import { IoTEntityCategory } from "../valueObjects/IoTEntityCategory";

export class IoTEntity {

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: IoTEntityCategory,
    public readonly capabilities: CapabilityStrategy[],
    public state: Record<string, unknown> = {},
    public attributes: Record<string, unknown> = {},
    public readonly relations: string[] = [],
    public readonly entityIds: string[] = []
  ) {}

  update(
    newState: Record<string, unknown>
  ): void {

    this.state = {
      ...this.state,
      ...newState
    };
  }

  hasChanged(
    other: IoTEntity
  ): boolean {

    return (
      JSON.stringify(this.state) !==
        JSON.stringify(other.state)
      ||
      JSON.stringify(this.attributes) !==
        JSON.stringify(other.attributes)
    );
  }

  get actions(): string[] {
    return [...new Set(this.capabilities.flatMap(capability =>capability.getActions()))];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      state: this.state,
      attributes: this.attributes,
      capabilities: this.capabilities.map(
        capability => capability.name
      ),
      actions: this.actions,
      relations: this.relations
    };
  }
}