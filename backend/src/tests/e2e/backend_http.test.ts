import request from "supertest";
import { app, startServer, server } from "../../main";

describe("HTTP E2E", () => {
  beforeAll(async () => {
    process.env.USE_MOCK_DATA = "true";
    await startServer();
  });

  afterAll(() => {
    server.close();
  });

  test("GET /devices", async () => {
    const res = await request(app).get("/devices");
    expect(res.status).toBe(200);
  });
});
