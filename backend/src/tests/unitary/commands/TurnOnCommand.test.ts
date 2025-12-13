import { TurnOnCommand } from "../../application/commands/TurnOnCommand";

test("TurnOnCommand calls HA API", async () => {
  const fakeHA = {
    callService: jest.fn(),
  };

  const fakeDevice = { id: "light.living_room" };

  const cmd = new TurnOnCommand(fakeDevice as any, fakeHA as any);

  await cmd.execute();

  expect(fakeHA.callService).toHaveBeenCalledWith(
    "light",
    "turn_on",
    { entity_id: "light.living_room" }
  );
});
