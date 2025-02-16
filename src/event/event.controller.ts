import { Controller, Get } from "@nestjs/common";
import { EventService } from "./event.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EventHtmlFetcher } from "./crawler/event.html.fetcher";

@Controller("/events")
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly fetcher: EventHtmlFetcher,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  @Get()
  public async getNewEvents(): Promise<string> {
    await this.fetcher.fetchEventsHTML();
    return await this.eventService.getEvents();
  }
}
