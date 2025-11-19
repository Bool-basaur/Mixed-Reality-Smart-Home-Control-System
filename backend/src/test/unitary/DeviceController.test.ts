import request from "supertest";
import { app } from "../../main";
import { deviceService } from "../../application/services/DeviceService";

jest.mock("../../../application/services/DeviceService");

describe("DeviceController", () => {
  test("GET /devices returns device list", async () => {
    (deviceService.list as jest.Mock).mockResolvedValue([
      { toJSON: () => ({ id: "1", name: "Lamp" }) }
    ]);

    const res = await request(app).get("/devices");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
