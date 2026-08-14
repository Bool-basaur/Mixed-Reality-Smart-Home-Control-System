import { ListEntitiesUseCase } from "../../../application/usecases/ListEntitiesUseCase";
import { EntityRegistryClass } from "../../../application/services/EntityRegistry";
import { InMemoryEntityStorage } from "../../../infrastructure/storage/InMemoryEntityStorage";

describe("ListEntitiesUseCase", () => {
  test("returns devices from registry", async () => {
    const registry = new EntityRegistryClass(new InMemoryEntityStorage());
    const uc = new ListEntitiesUseCase(registry);

    const result = await uc.execute();
    expect(Array.isArray(result)).toBe(true);
  });
});
