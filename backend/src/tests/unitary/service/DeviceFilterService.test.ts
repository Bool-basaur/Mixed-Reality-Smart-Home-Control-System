import { DeviceFilterService } from "../../../application/services/DeviceFilterService";
import { GenericDevice } from "../../../domain/entities/GenericDevice";

describe("DeviceFilterService", () => {
  test("filters technical and diagnostic entities", () => {
    const service = new DeviceFilterService();

    const devices = [
      new GenericDevice("switch.enchufe_tapo", "Tapo", "switch", [], { }),
      new GenericDevice("switch.enchufe_tapo_led", "LED", "switch", [], { entity_category: "diagnostic" }),
      new GenericDevice("media_player.tv", "TV", "media_player", [], { }),
    ];

    const result = service.filter(devices);

    expect(result).toHaveLength(2);
    expect(result.map(d => d.id)).toContain("switch.enchufe_tapo");
    expect(result.map(d => d.id)).toContain("media_player.tv");
  });
});
