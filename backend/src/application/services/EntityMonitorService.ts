import fs from "fs";
import path from "path";

import { EntityRegistryClass } from "./EntityRegistry";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { IoTEntity } from "../../domain/entities/IoTEntity";
import { EntityAggregationService } from "./EntityAggregationService";
import { IoTEntityFactory } from "../../domain/factories/IoTEntityFactory";
import { logger } from "../../infrastructure/logger";
import { spatialEntityContextService, spatialInformationService} from ".";

export class EntityMonitorService {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private readonly registry: EntityRegistryClass,
    private readonly haClient: IHomeAssistantAPI
  ) {}

  private saveSnapshot(entities: IoTEntity[]): void {
    try {
      const dataDir = path.resolve(
        process.cwd(),
        "data"
      );

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(
          dataDir,
          {
            recursive: true
          }
        );
      }

      fs.writeFileSync(
        path.join(dataDir, "entity-snapshot.json"),
        JSON.stringify(
          entities.map(entity =>
            entity.toJSON()
          ),
          null,
          2
        )
      );

    } catch (err) {
      logger.error(
        "Error saving entity snapshot",
        err
      );
    }
  }

  private async synchronize(): Promise<void> {

    const entities = await this.haClient.getAllEntities();

    const devices = await this.haClient.getDeviceRegistry();

    const entityRegistry = await this.haClient.getEntityRegistry();

    const aggregator = new EntityAggregationService();

    const physicalDevices = aggregator.aggregate(entities, devices, entityRegistry);

    const latest = physicalDevices.map(device => IoTEntityFactory.fromPhysicalDevice(device ));
    
    const previousIds = this.registry.getAll().map(entity => entity.id);

    const currentIds = latest.map(entity => entity.id);

    const removedIds = previousIds.filter(id => !currentIds.includes(id));
    
    for (const entityId of removedIds) {
      await spatialInformationService.remove(entityId);
    }

    this.registry.replaceAll(latest);

    await spatialEntityContextService.rebuild();

    this.saveSnapshot(latest);

    logger.info(`Monitored ${latest.length} entities`);

    logger.info(`Registry contains ${this.registry.count()} entities`);
  }

  start(): void {

    if (this.intervalId) {
      return;
    }

    this.synchronize()
      .catch(err =>
        logger.error(
          "Initial synchronization failed",
          err
        )
      );

    this.intervalId = setInterval(
      async () => {
        try {
          await this.synchronize();
        } catch (err) {
          logger.error(
            "Error in EntityMonitorService:",
            err
          );
        }
      },
      5000
    );
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}