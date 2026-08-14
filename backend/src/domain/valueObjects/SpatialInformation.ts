export class SpatialInformation {

  constructor(
    public readonly entityId: string,

    public readonly homeId?: string,
    public readonly roomId?: string,
    public readonly zoneId?: string,

    public readonly position?: {
      x: number;
      y: number;
      z: number;
    },

    public readonly rotation?: {
      x: number;
      y: number;
      z: number;
    }
  ) {}
}