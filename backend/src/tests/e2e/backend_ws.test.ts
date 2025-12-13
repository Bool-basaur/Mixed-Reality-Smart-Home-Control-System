import request from "supertest";
import { startServer, app, server } from "../../main";
import { closeWebSocketServer } from "../../api/ws/WebSocketServer";

describe("GET /devices (E2E)", () => {
  beforeAll(async () => {
    process.env.USE_MOCK_DATA = "true";
    process.env.ENABLE_WS = "false";
    await startServer();
  });

  afterAll(() => {
    closeWebSocketServer();
    server.close();
  });

  test("returns device list", async () => {
    const res = await request(app).get("/devices");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
