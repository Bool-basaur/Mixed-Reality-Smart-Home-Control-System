import WebSocket from "ws";
import { startServer, server } from "../../main";

describe("E2E WebSocket", () => {
  beforeAll(async () => {
    process.env.USE_MOCK_DATA = "true";
    await startServer();
  });

  afterAll(() => {
    server.close();
  });

  test("connects and receives device list", (done) => {
    const ws = new WebSocket("ws://localhost:3000/ws");

    ws.on("message", (msg) => {
      const data = JSON.parse(msg.toString());
      if (data.type === "devices") {
        expect(Array.isArray(data.payload)).toBe(true);
        ws.close();
        done();
      }
    });
  });
});
