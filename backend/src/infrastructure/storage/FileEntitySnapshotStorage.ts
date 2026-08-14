import fs from "fs";
import path from "path";

import { IoTEntity }
  from "../../domain/entities/IoTEntity";

import { IEntitySnapshotStorage }
  from "../../domain/interfaces/IEntitySnapshotStorage";

export class FileEntitySnapshotStorage
  implements IEntitySnapshotStorage {

  private readonly filePath =
    path.resolve(
      process.cwd(),
      "data/entity-snapshot.json"
    );

  constructor() {

    if (!fs.existsSync(this.filePath)) {

      fs.writeFileSync(
        this.filePath,
        "[]",
        "utf8"
      );
    }
  }

  async saveAll(
    entities: IoTEntity[]
  ): Promise<void> {

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(
        entities,
        null,
        2
      )
    );
  }

  async getAll():
    Promise<IoTEntity[]> {

    const raw =
      fs.readFileSync(
        this.filePath,
        "utf8"
      );

    if (!raw.trim()) {
      return [];
    }

    return JSON.parse(raw);
  }
}