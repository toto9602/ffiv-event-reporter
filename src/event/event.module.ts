import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { CrawlerModule } from "./crawler/crawler.module";
import { WorkflowRunner } from "./workflow.runner";

@Module({
  imports: [CrawlerModule],
  controllers: [EventController],
  providers: [EventService, WorkflowRunner],
})
export class EventModule {}
