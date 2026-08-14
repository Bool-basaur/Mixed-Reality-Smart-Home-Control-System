import { IoTEntity } from "../../domain/entities/IoTEntity";
import { IHomeAssistantAPI } from "../../domain/interfaces/IHomeAssistantAPI";
import { IEntityStorage } from "../../domain/interfaces/IEntityStorage";

import { EventBus, EVENTS } from "../../infrastructure/events/events";
import { logger } from "../../infrastructure/logger";

interface EntityChanges {
  added: IoTEntity[];
  updated: IoTEntity[];
  removed: IoTEntity[];
}

class EntityRegistryClass{
  private haClient: IHomeAssistantAPI | null = null;

  constructor(
    private readonly storage: IEntityStorage
  ) { }

  async init(): Promise<void> {
    logger.info(
      "EntityRegistry initializing..."
    );
  }

  replaceAll(
    entities: IoTEntity[]
  ): void {

    const currentEntities =
      this.getAll();

    const changes =
      this.calculateChanges(
        currentEntities,
        entities
      );

    this.storage.clear();

    entities.forEach(entity =>
      this.storage.save(entity)
    );

    this.publishChanges(
      changes
    );
  }

  private calculateChanges(
    currentEntities: IoTEntity[],
    nextEntities: IoTEntity[]
  ): EntityChanges {

    const currentById = new Map(
      currentEntities.map(entity => [
        entity.id,
        entity
      ])
    );

    const nextById = new Map(
      nextEntities.map(entity => [
        entity.id,
        entity
      ])
    );

    const added = nextEntities.filter(
      entity =>
        !currentById.has(
          entity.id
        )
    );

    const removed = currentEntities.filter(
      entity =>
        !nextById.has(
          entity.id
        )
    );

    const updated = nextEntities.filter(
      entity => {

        const current = currentById.get(entity.id);

        return current ? current.hasChanged(entity) : false;
      }
    );

    return { added, updated, removed };
  }

  private publishChanges(changes: EntityChanges): void {
    changes.added.forEach(entity => {
      EventBus.emit(EVENTS.ENTITY_ADDED, entity);
    });

    changes.updated.forEach(entity => {
      EventBus.emit(EVENTS.ENTITY_STATE_UPDATED, entity);
    });

    changes.removed.forEach(entity => { 
      EventBus.emit(EVENTS.ENTITY_REMOVED, entity.id);
    });
  }

  getAll(): IoTEntity[] {
    return this.storage.getAll();
  }

  getById(id: string): IoTEntity | undefined {
    return this.storage.getById(id);
  }

  contains(id: string): boolean {
    return !!this.storage.getById(id);
  }

  count(): number {
    return this.storage.getAll().length;
  }

  setHA(ha: IHomeAssistantAPI): void {
    this.haClient = ha;
  }

  getHA(): IHomeAssistantAPI | null {
    return this.haClient;
  }
  
}

export { EntityRegistryClass};