import { EntityRegistryClass } from "./EntityRegistry";
import { InMemoryEntityStorage } from "../../infrastructure/storage/InMemoryEntityStorage";
import { EntityService } from "./EntityService";
import { SpatialInformationService } from "./SpatialInformationService";
import { FileSpatialInformationStorage } from "../../infrastructure/storage/FileSpatialInformationStorage";
import { SpatialEntityContextRegistry } from "./SpatialEntityContextRegistry";
import { SpatialEntityContextService } from "./SpatialEntityContextService";

const storage = new InMemoryEntityStorage();
export const EntityRegistry = new EntityRegistryClass(storage);
export const entityService = new EntityService(EntityRegistry);
const spatialStorage = new FileSpatialInformationStorage();

export const spatialEntityContextRegistry = new SpatialEntityContextRegistry();
export const spatialEntityContextService = new SpatialEntityContextService(EntityRegistry, spatialStorage, spatialEntityContextRegistry);
export const spatialInformationService = new SpatialInformationService(spatialStorage, spatialEntityContextService);