import fs from "fs";
import path from "path";
import { SpatialInformation } from "../../domain/valueObjects/SpatialInformation";
import { ISpatialInformationStorage } from "../../domain/interfaces/ISpatialInformationStorage";
import { logger } from "../logger";

export class FileSpatialInformationStorage
  implements ISpatialInformationStorage {

  private readonly filePath = path.resolve(process.cwd(), "data/spatial-information.json");
  private readonly cache = new Map<string, SpatialInformation>();
  constructor() {
    
  if (!fs.existsSync(this.filePath)) {
    fs.writeFileSync(this.filePath, "[]", "utf8");
  }
  const items =  this.load();

  items.forEach(item => {
    this.cache.set(item.entityId,item);
  });
}

  private load(): SpatialInformation[] {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    const raw = fs.readFileSync(this.filePath,"utf8");

    if (!raw.trim()) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch (error) {

      logger.info("[FILE STORAGE] JSON parse error:", error);

      return [];
    }
  }

  async save(
  spatialInfo: SpatialInformation
): Promise<void> {

  const current = this.load();

  const filtered = current.filter(item => item.entityId !== spatialInfo.entityId);

  filtered.push(spatialInfo);

  this.cache.set(spatialInfo.entityId, spatialInfo);

  const content =JSON.stringify(filtered, null, 2);

  fs.writeFileSync(this.filePath, content);

}

  async getByEntityId(entityId: string): Promise<SpatialInformation | null> {
    return (this.cache.get(entityId) ?? null);
  }

  async getAll(): Promise<SpatialInformation[]> {
    return [...this.cache.values()];
  }

  async remove(entityId: string): Promise<void> {

    this.cache.delete(
      entityId
    );

    const filtered =
      this.load().filter(
        item =>
          item.entityId !== entityId
      );

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(
        filtered,
        null,
        2
      )
    );
  }
}