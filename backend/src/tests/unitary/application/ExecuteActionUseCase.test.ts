import { ExecuteActionUseCase } from "../../../application/usecases/ExecuteActionUseCase";
import { EntityRegistryClass } from "../../../application/services/EntityRegistry";
import { InMemoryEntityStorage } from "../../../infrastructure/storage/InMemoryEntityStorage";

describe("ExecuteActionUseCase", () => {
  test("fails if device not found", async () => {
    const registry = new EntityRegistryClass(new InMemoryEntityStorage());

    const uc = new ExecuteActionUseCase(registry);
    const res = await uc.execute("x", "turn_on", {});

    expect(res.error).toBeDefined();
  });
});
