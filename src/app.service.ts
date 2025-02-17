import { Injectable } from "@nestjs/common";
import { EventCrawler } from "./crawler/event.crawler";
import { WorkflowRunner } from "./runner/workflow.runner";

@Injectable()
export class AppService {
  constructor(
    private readonly crawler: EventCrawler,
    private readonly runner: WorkflowRunner,
  ) {}

  public async runEventWorkflow() {
    const newEvents = await this.crawler.run();

    this.runner.runReportEvents(newEvents);
  }
}
