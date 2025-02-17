import { Injectable } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";
import { EventHtmlParser } from "./event.html.parser";
import { parser } from "typescript-eslint";
import { EventDto } from "./dto/event.dtos";

@Injectable()
export class EventCrawler {
  constructor(
    private readonly fetcher: EventHtmlFetcher,
    private readonly parser: EventHtmlParser,
  ) {}

  public async run(): Promise<EventDto[]> {
    const eventHtml = await this.fetcher.fetchEventsHTML();

    return this.parser.parseEvents(eventHtml);
  }
}
