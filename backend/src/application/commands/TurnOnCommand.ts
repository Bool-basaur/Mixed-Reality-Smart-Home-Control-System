export class TurnOnCommand {
  constructor(private readonly haClient: any) {}

  async execute(entityId: string): Promise<void> {
    await this.haClient.callService({
      domain: entityId.split(".")[0],
      service: "turn_on",
      service_data: {
        entity_id: entityId
      }
    });
  }
}
