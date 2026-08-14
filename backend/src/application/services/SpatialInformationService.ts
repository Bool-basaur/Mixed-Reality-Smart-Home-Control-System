import { SpatialInformation } from "../../domain/valueObjects/SpatialInformation";
import { ISpatialInformationStorage } from "../../domain/interfaces/ISpatialInformationStorage";
import { SpatialEntityContextService } from "./SpatialEntityContextService";

export class SpatialInformationService {

  constructor(
    private readonly storage: ISpatialInformationStorage,
    private readonly spatialEntityContextService: SpatialEntityContextService
  ) {}

  async save(
    spatialInfo: SpatialInformation
  ): Promise<void> {

    await this.storage.save(spatialInfo);
    await this.spatialEntityContextService.rebuild();  }

  async getByEntityId(entityId: string): Promise<SpatialInformation | null> {

    return this.storage.getByEntityId(entityId);
  }

  async getAll(): Promise<SpatialInformation[]> {
    return this.storage.getAll();
  }

  async remove(entityId: string): Promise<void> {
    await this.storage.remove(entityId);
    await this.spatialEntityContextService.rebuild();
  }
}