import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { AppController } from "./app.controller";
import { CrawlerModule } from "./crawler/crawler.module";
import { RunnerModule } from "./runner/runner.module";
import { AppService } from "./app.service";

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
    CrawlerModule,
    RunnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
