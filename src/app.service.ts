import { Injectable } from "@nestjs/common";
import { EventCrawler } from "./crawler/event.crawler";
import { EventDetailCrawler } from "./crawler/event.detail.crawler";
import { WorkflowRunner } from "./runner/workflow.runner";
import { EventContentParser } from "./parser/event.content.parser";

@Injectable()
export class AppService {
  constructor(
    private readonly crawler: EventCrawler,
    private readonly eventDetailCrawler: EventDetailCrawler,
    private readonly eventDetailParser: EventContentParser,
    private readonly runner: WorkflowRunner,
  ) {}

  public async fetchNewEvents() {
    await this.crawler.run();
  }

  public async runEventDetailCrawl() {
    await this.eventDetailCrawler.crawlEventDetails();
  }

  public async parseEventDetails() {
    await this.eventDetailParser.parse();
  }

  public async runReportEvents() {
    await this.runner.runReportEvents();
  }
}
