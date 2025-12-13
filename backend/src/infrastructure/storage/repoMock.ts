import { GenericDevice } from "../../domain/entities/GenericDevice";
import { OnOffCapability } from "../../domain/capabilities/impl/OnOfCapability"

export const repoMock = {
  async getAll() {
    return [
      new GenericDevice(
        "switch.mock_lamp",
        "Mock Lamp",
        "switch",
        [new OnOffCapability()],
        { state: "off" }
      ),
    ];
  },
};
