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

          mainState: this.resolveState(
            context.entity
          ),

          state: context.entity.state,

          attributes:
            context.entity.attributes,

          capabilities:
            context.entity.capabilities.map(
              capability => capability.name
            ),

          actions:
            context.entity.actions,

          relations:
            context.entity.relations
        },

        spatialInformation:
          context.spatialInformation
      })
    );
  }

  private resolveState(
  entity: IoTEntity
): string {

  const stateEntries =
    Object.entries(entity.state);

  const primaryState =
    stateEntries.find(([key]) =>
      key.startsWith("switch.")
    );

  if (primaryState) {
    return this.normalizeState(
      String(primaryState[1])
    );
  }

  const mediaPlayerState =
    stateEntries.find(([key]) =>
      key.startsWith("media_player.")
    );

  if (mediaPlayerState) {
    return this.normalizeState(
      String(mediaPlayerState[1])
    );
  }

  const cameraState =
    stateEntries.find(([key]) =>
      key.startsWith("camera.")
    );

  if (cameraState) {
    return this.normalizeState(
      String(cameraState[1])
    );
  }

  return "off";
}

private normalizeState(
  state: string
): string {

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