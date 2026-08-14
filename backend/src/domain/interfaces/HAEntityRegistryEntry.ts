export interface HAEntityRegistryEntry {
  entityId: string;

  deviceId?: string | null;

  areaId?: string | null;

  uniqueId?: string;

  platform?: string;
}