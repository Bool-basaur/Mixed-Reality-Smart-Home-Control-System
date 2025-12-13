import { TurnOnCommand } from "../../../application/commands/TurnOnCommand";

test("TurnOnCommand calls HA API", async () => {
  const fakeHA = {
    callService: jest.fn(),
  };

  const cmd = new TurnOnCommand(fakeHA as any);

  await cmd.execute("light.living_room");

  expect(fakeHA.callService).toHaveBeenCalledWith({
    domain: "light",
    service: "turn_on",
    service_data: {
      entity_id: "light.living_room"
    }
  });
});
