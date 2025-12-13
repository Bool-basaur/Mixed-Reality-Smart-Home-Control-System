import { resolveHAUrl } from "../../../infrastructure/ha/HAUrlResolver";

describe("resolveHAUrl", () => {
  test("adds websocket protocol", () => {
    const url = resolveHAUrl("homeassistant.local");
    expect(url.startsWith("ws://")).toBe(true);
  });
});
