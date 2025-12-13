import { DeviceFilterService } from "../../../application/services/DeviceFilterService";
import { GenericDevice } from "../../../domain/entities/GenericDevice";

describe("DeviceFilterService", () => {
  test("filters technical entities by id", () => {
    const service = new DeviceFilterService();

    const devices = [
      new GenericDevice("switch.enchufe_tapo", "Tapo", "switch", [], {}),
      new GenericDevice("switch.enchufe_tapo_led", "LED", "switch", [], {}),
      new GenericDevice("media_player.tv", "TV", "media_player", [], {}),
    ];

    const result = service.filter(devices);

    expect(result.map(d => d.id)).toEqual([
      "switch.enchufe_tapo",
      "media_player.tv"
    ]);
  });
});
