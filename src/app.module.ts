import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { AppController } from "./app.controller";
import { CrawlerModule } from "./crawler/crawler.module";
import { RunnerModule } from "./runner/runner.module";
import { AppService } from "./app.service";
import { getMikroOrmModule } from "./common/database/getMikroOrmModule";
import { ScheduleModule } from "@nestjs/schedule";
import { EventDateUpdaterModule } from "./date-updater/event.date.updater.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(
        process.cwd(),
        "env",
        `.${process.env.NODE_ENV}.env`,
      ),
      isGlobal: true,
    }),
    getMikroOrmModule(),
    CrawlerModule,
    RunnerModule,
    ScheduleModule.forRoot(),
    EventDateUpdaterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
