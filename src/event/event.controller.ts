import { Controller, Get } from "@nestjs/common";
import { EventService } from "./event.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EventHtmlFetcher } from "./crawler/event.html.fetcher";
import { EventHtmlParser } from "./crawler/event.html.parser";

@Controller("/events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  @Get()
  public async getNewEvents(): Promise<void> {
    await this.eventService.getEvents();
  }
}
