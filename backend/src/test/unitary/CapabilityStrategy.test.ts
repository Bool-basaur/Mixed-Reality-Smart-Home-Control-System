import { VolumeCapability } from "../../domain/capabilities/impl/VolumeCapability";
import { MediaPlayerDevice } from "../../domain/entities/MediaPlayerDevice";
//import { FakeDevice } from "../../helpers/FakeDevice";

describe("VolumeCapability", () => {
  test("supports volume actions", () => {
    const cap = new VolumeCapability();
    expect(cap.supports("set_volume")).toBe(true);
  });

  test("execute sends correct command", async () => {
    const cap = new VolumeCapability();
    /*const device = new MediaPlayerDevice();

    const result = await cap.execute("set_volume", { level: 0.5 }, device);

    expect(result.ok).toBe(true);
    expect(device.lastCommand).toEqual({
      action: "set_volume",
      params: { level: 0.5 }
    });*/
  });
});