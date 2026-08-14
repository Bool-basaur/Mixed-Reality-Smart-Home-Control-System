import { SpatialEntityContext }
  from "../../domain/valueObjects/SpatialEntityContext";

export class SpatialEntityContextRegistry {

  private readonly contexts =
    new Map<
      string,
      SpatialEntityContext
    >();

  set(
    context: SpatialEntityContext
  ): void {

    this.contexts.set(
      context.entity.id,
      context
    );
  }

  getByEntityId(
    entityId: string
  ): SpatialEntityContext | undefined {

    return this.contexts.get(
      entityId
    );
  }

  getAll():
    SpatialEntityContext[] {

    return [
      ...this.contexts.values()
    ];
  }

  remove(
    entityId: string
  ): void {

    this.contexts.delete(
      entityId
    );
  }

  clear(): void {
    this.contexts.clear();
  }
}