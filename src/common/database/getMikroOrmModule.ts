import { MikroOrmModule } from "@mikro-orm/nestjs";

import * as path from "path";
import { SqliteDriver } from "@mikro-orm/sqlite";

export function getMikroOrmModule() {
  const prefix = process.env.NODE_ENV === "production" ? "prod" : "test";

  const isProd = process.env.NODE_ENV === "production";

  return MikroOrmModule.forRoot({
    entities: isProd
      ? [path.join(__dirname, "../../**/entity/*.entity.js")]
      : [path.join(__dirname, "../../**/entity/*.entity.js")],
    entitiesTs: isProd
      ? []
      : [path.join(__dirname, "../../**/entity/*.entity.ts")],
    dbName: `${prefix}.sqlite3`,
    driver: SqliteDriver,
    driverOptions: {
      pragma: {
        journal_mode: "WAL",
        busy_timeout: 5000,
      },
    },
  });
}
