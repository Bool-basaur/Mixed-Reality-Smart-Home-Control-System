import { DeviceFactory } from "../../domain/factories/DeviceFactory";

describe("DeviceFactory", () => {
  test("maps media_player to MediaPlayerDevice", () => {
    const entity = {
      entity_id: "media_player.tv",
      domain: "media_player",
      attributes: {},
      state: "on",
    };

    const device = DeviceFactory.fromHAEntity(entity);

    expect(device.constructor.name).toBe("MediaPlayerDevice");
  });
});
