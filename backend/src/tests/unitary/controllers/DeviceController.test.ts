import request from "supertest";
import express from "express";
import { listDevices } from "../../../api/controllers/DeviceController";

const app = express();
app.get("/devices", listDevices);

jest.mock("../../../application/usecases/ListDevicesUseCase", () => {
  return {
    ListDevicesUseCase: jest.fn().mockImplementation(() => {
      return {
        execute: jest.fn().mockResolvedValue([
          { toJSON: () => ({ id: "1", name: "Lamp" }) }
        ])
      };
    })
  };
});


describe("DeviceController", () => {
  test("GET /devices returns device list", async () => {
    const res = await request(app).get("/devices");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe("1");
  });
});
