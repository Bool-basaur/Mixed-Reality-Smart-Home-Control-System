import { repoMock } from '../../../infrastructure/db/repoMock';
import { DeviceRegistry } from '../../../application/services/DeviceRegistry';
import { deviceService } from '../../../application/services/DeviceService';

describe('Device domain & service tests', () => {

  beforeEach(async () => {
    process.env.USE_MOCK_DATA = 'true';
    await DeviceRegistry.init();
  });

  test('repoMock contains seeded devices', async () => {
    const list = await repoMock.getAll();
    expect(list.length).toBeGreaterThan(0);
  });

  test('DeviceService.list returns devices', async () => {
    const devices = await deviceService.list();
    expect(devices.length).toBeGreaterThan(0);
  });

  test('executeAction fails if action not supported', async () => {
    const devices = await deviceService.list();
    expect(devices.length).toBeGreaterThan(0);

    const d = devices[0]!;

    const res = await deviceService.executeAction(
      d.id,
      'non_existing_action',
      {}
    );

    expect(res.ok).toBe(false);
    expect(res.error).toContain("not supported");
  });
});
