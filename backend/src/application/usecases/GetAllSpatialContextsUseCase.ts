import { SpatialEntityContextService }
  from "../services/SpatialEntityContextService";

import { SpatialEntityContext }
  from "../../domain/valueObjects/SpatialEntityContext";

import { IoTEntity }
  from "../../domain/entities/IoTEntity";

export class GetAllSpatialContextsUseCase {

  constructor(
    private readonly contextService:
      SpatialEntityContextService
  ) {}

  execute() {

    return this.contextService.getAll().map(
      context => ({
        entity: {
          id: context.entity.id,
          name: context.entity.name,
          category: context.entity.category,

          mainState: this.resolveState(context.entity),

          state: context.entity.state,

          attributes: context.entity.attributes,

          capabilities: context.entity.capabilities.map(capability => capability.name),

          actions: context.entity.actions,

          relations: context.entity.relations
        },

        spatialInformation: context.spatialInformation
      })
    );
  }

  private resolveState(entity: IoTEntity): string {

    const primarySwitch = Object.entries(entity.state).filter(([key]) => key.startsWith("switch.")).sort((a, b) => a[0].length - b[0].length)[0];

    if (!primarySwitch) {
      return "off";
    }

    return this.normalizeState( String(primarySwitch[1]));
  }

  private normalizeState(state: string): string {

    const value =
      state.toLowerCase();

    if (
      value === "unavailable" ||
      value === "unknown" ||
      value === "off"
    ) {
      return "off";
    }

    return "on";
  }
}