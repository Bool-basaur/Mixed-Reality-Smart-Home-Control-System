import { VolumeCapability } from "../../domain/capabilities/impl/VolumeCapability";
import { MediaPlayerDevice } from "../../domain/entities/MediaPlayerDevice";

describe("VolumeCapability", () => {
  test("supports volume actions", () => {
    const cap = new VolumeCapability();
    expect(cap.supports("set_volume")).toBe(true);
  });

  test("execute sends correct command", async () => {
    const cap = new VolumeCapability();
  });
});