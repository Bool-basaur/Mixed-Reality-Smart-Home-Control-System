import { HAEntity } from "../interfaces/HAEntity";

export class PhysicalDevice {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly primaryEntity: HAEntity,
    public readonly entities: HAEntity[]
  ) {}
}