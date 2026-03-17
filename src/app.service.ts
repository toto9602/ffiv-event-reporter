import { Injectable } from "@nestjs/common";
import { EventCrawler } from "./crawler/event.crawler";
import { WorkflowRunner } from "./runner/workflow.runner";
import { EventDateUpdater } from "./date-updater/event.date.updater";

@Injectable()
export class AppService {
  constructor(
    private readonly crawler: EventCrawler,
    private readonly runner: WorkflowRunner,
    private readonly eventDateUpdater: EventDateUpdater,
  ) {}

  public async runEventWorkflow() {
    const newEvents = await this.crawler.run();

    await this.runner.runReportEvents(newEvents);
  }

  public async updateEventPeriods() {
    await this.eventDateUpdater.run();
  }

  public async runReportEventsWithPeriods() {
    await this.runner.runForEventsWithPeriods();
  }

  public async sendEventStartReminders() {
    await this.runner.sendEventStartReminders();
  }
}
