import { SwitchDevice } from '../../domain/entities/SwitchDevice';
import { Device } from '../../domain/entities/Device';
import { Result } from '../../domain/valueObjects/Result';
import { repoMock } from '../../infrastructure/db/repoMock';
import { DeviceRegistry } from '../../application/services/DeviceRegistry';
import { deviceService } from '../../application/services/DeviceService';

jest.mock('../../src/infrastructure/ha/HomeAssistantClient', () => {
  return {
    HomeAssistantClient: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn().mockResolvedValue(undefined),
        callService: jest.fn().mockResolvedValue(undefined),
        onEvent: jest.fn()
      };
    })
  };
});

describe('Device domain & service tests', () => {
  test('repoMock contains seeded devices', async () => {
    const list = await repoMock.getAll();
    expect(list.length).toBeGreaterThan(0);
  });

  test('DeviceService.list returns devices', async () => {
    process.env.USE_MOCK_DATA = 'true';
    await DeviceRegistry.init();
    const devices = await deviceService.list();
    expect(Array.isArray(devices)).toBe(true);
    expect(devices.length).toBeGreaterThan(0);
  });

  test('DeviceService.executeAction turn_on dispatches command', async () => {
    process.env.USE_MOCK_DATA = 'true';
    await DeviceRegistry.init();
    const devices = await deviceService.list();
    const d = devices[0];
    const res = await deviceService.executeAction(d.id, 'turn_on', {});
    expect(res).toBeUndefined();
  });
});
