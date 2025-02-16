import { Injectable } from "@nestjs/common";
import { EventHtmlFetcher } from "./crawler/event.html.fetcher";
import { EventHtmlParser } from "./crawler/event.html.parser";
import { WorkflowRunner } from "./workflow.runner";

@Injectable()
export class EventService {
  constructor(
    private readonly fetcher: EventHtmlFetcher,
    private readonly parser: EventHtmlParser,
    private readonly runner: WorkflowRunner,
  ) {}

  public async getEvents() {
    const html = await this.fetcher.fetchEventsHTML();

    const parsedEvents = this.parser.parseEvents(html);

    this.runner.runReportEvents(parsedEvents);
  }
}
