import { EntityRegistry} from "../services";
import { spatialInformationService } from "../services";
import { ListEntitiesUseCase } from "./ListEntitiesUseCase";
import { GetAllSpatialDigitalTwinsUseCase } from "./GetAllSpatialDigitalTwinsUseCase";
import { GetSpatialDigitalTwinUseCase } from "./GetSpatialDigitalTwinUseCase";
import { GetSpatialInformationUseCase } from "./GetSpatialInformationUseCase";
import { SetSpatialInformationUseCase } from "./SetSpatialInformationUseCase";
import { GetAllSpatialContextsUseCase } from "./GetAllSpatialContextsUseCase";
import { spatialEntityContextService } from "../services";
import { GetSpatialContextUseCase } from "./GetSpatialContextUseCase";
import { ExecuteActionUseCase } from "./ExecuteActionUseCase";
import { GetSystemSnapshotUseCase } from "./GetSystemSnapshotUseCase";
import { GetUnconfiguredSpatialContextsUseCase } from "./GetUnconfiguredSpatialContextsUseCase";


export const listEntitiesUseCase = new ListEntitiesUseCase(EntityRegistry );

export const getSpatialInformationUseCase = new GetSpatialInformationUseCase(spatialInformationService);

export const setSpatialInformationUseCase = new SetSpatialInformationUseCase(spatialInformationService);

export const getSpatialDigitalTwinUseCase = new GetSpatialDigitalTwinUseCase(EntityRegistry, spatialInformationService);

export const getAllSpatialDigitalTwinsUseCase = new GetAllSpatialDigitalTwinsUseCase(EntityRegistry, spatialInformationService);

export const getAllSpatialContextsUseCase = new GetAllSpatialContextsUseCase(spatialEntityContextService);

export const getSpatialContextUseCase = new GetSpatialContextUseCase(spatialEntityContextService);

export const executeActionUseCase = new ExecuteActionUseCase(EntityRegistry);

export const getSystemSnapshotUseCase = new GetSystemSnapshotUseCase(EntityRegistry, spatialEntityContextService);

export const getUnconfiguredSpatialContextsUseCase = new GetUnconfiguredSpatialContextsUseCase(spatialEntityContextService);