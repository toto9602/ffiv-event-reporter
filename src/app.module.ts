import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { AppController } from "./app.controller";
import { CrawlerModule } from "./crawler/crawler.module";
import { RunnerModule } from "./runner/runner.module";
import { AppService } from "./app.service";
import { getMikroOrmModule } from "./common/database/getMikroOrmModule";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(
        __dirname,
        "../env",
        `.${process.env.NODE_ENV}.env`,
      ),
      isGlobal: true,
    }),
    getMikroOrmModule(),
    CrawlerModule,
    RunnerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
