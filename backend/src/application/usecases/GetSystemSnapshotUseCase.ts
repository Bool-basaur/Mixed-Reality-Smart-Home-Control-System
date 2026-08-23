import { EntityRegistryClass } from "../services/EntityRegistry";
import { SpatialEntityContextService } from "../services/SpatialEntityContextService";
import { IoTEntity } from "../../domain/entities/IoTEntity";

export class GetSystemSnapshotUseCase {

  constructor(private readonly registry: EntityRegistryClass,
    private readonly contextService: SpatialEntityContextService) {}

  execute() {
    return {
      entities: this.registry.getAll().map(entity => ({
        id: entity.id,
        name: entity.name,
        category: entity.category,

        mainState: this.resolveState(entity),

        states: entity.state,

        capabilities: entity.capabilities.map(c => c.name),
        actions: entity.actions,

        attributes: entity.attributes,
        relations: entity.relations
      })),
      spatialContexts: this.contextService.getAll()
    };
  }

  private resolveState(entity: IoTEntity): string {
    const stateEntries = Object.entries(entity.state);

    const primaryState = stateEntries.find(([key]) => key.startsWith("switch."));

    if (primaryState) {
      return this.normalizeState(String(primaryState[1]));
    }

    const mediaPlayerState = stateEntries.find(([key]) =>key.startsWith("media_player."));

    if (mediaPlayerState) {
      return this.normalizeState(String(mediaPlayerState[1]));
    }

    const cameraState = stateEntries.find(([key]) => key.startsWith("camera."));

    if (cameraState) {
      return this.normalizeState(String(cameraState[1]));
    }

    return "off";
  }

  private normalizeState(state: string): string {

    const value = state.toLowerCase();
    if (value === "unavailable" || value === "unknown" || value === "off") {
      return "off";
    }

    return "on";
  }
}