import { HAEntity } from "../interfaces/HAEntity";

export class SemanticStateMapper {

  static build(
    entities: HAEntity[]
  ): Record<string, unknown> {

    const state: Record<string, unknown> = {};

    for (const entity of entities) {

      const semanticKey =
        this.resolveKey(entity);

      if (!semanticKey) {
        continue;
      }

      state[semanticKey] =
        entity.state;
    }

    return state;
  }

  private static resolveKey(
    entity: HAEntity
  ): string | null {

    const id =
      entity.entity_id.toLowerCase();

    if (
      id.includes("conexion_a_la_nube")
    ) {
      return "cloudConnected";
    }

    if (
      id.includes("nivel_de_senal")
    ) {
      return "signalLevel";
    }

    if (
      id.includes("apagar_en")
    ) {
      return "shutdownDelay";
    }

    if (
      id.includes("apagado_automatico_habilitado")
    ) {
      return "autoShutdownEnabled";
    }

    if (
      id.endsWith("_led") ||
      id.includes("_led_")
    ) {
      return "ledEnabled";
    }

    if (
      id.startsWith("switch.") &&
      !id.includes("_led") &&
      !id.includes("automatico")
    ) {
      return "power";
    }

    if (
      id.startsWith("camera.")
    ) {
      return "cameraStatus";
    }

    return null;
  }
}
