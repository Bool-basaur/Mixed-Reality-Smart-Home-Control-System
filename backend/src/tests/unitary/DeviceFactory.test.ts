import { DeviceFactory } from "../../domain/factories/DeviceFactory";

describe("DeviceFactory", () => {
  test("maps media_player to MediaPlayerDevice", () => {
    const fakeHA = {} as any;

    const entity = {
      entity_id: "media_player.tv",
      domain: "media_player",
      attributes: {},
      state: "on",
    };

    const device = DeviceFactory.fromHA(entity as any, fakeHA);

    expect(device).not.toBeNull();
    expect(device!.constructor.name).toBe("MediaPlayerDevice");
  });
});
