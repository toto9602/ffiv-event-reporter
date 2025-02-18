import { MikroOrmModule } from "@mikro-orm/nestjs";

import * as path from "path";
import { SqliteDriver } from "@mikro-orm/sqlite";

export function getMikroOrmModule() {
  const prefix = process.env.NODE_ENV === "production" ? "prod" : "test";

  return MikroOrmModule.forRoot({
    entities: [path.join(__dirname, "../../**/entity/*.entity.js")],
    entitiesTs: [path.join(__dirname, "../../**/entity/*.entity.ts")],
    dbName: `${prefix}.sqlite3`,
    driver: SqliteDriver,
  });
}
