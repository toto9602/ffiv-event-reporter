import { Controller, Get, Post } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Cron(CronExpression.EVERY_MINUTE)
  @Post("/fetch-new-events")
  public async fetchNewEvents() {
    await this.appService.fetchNewEvents();
  }

  @Post("/update-event-periods")
  public async updateEventPeriods() {
    await this.appService.updateEventPeriods();
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  @Post("/report-new-events")
  public async runReportEventsWithPeriods() {
    await this.appService.reportNewEvents();
  }

  // @Cron("0 0 * * *")
  @Post("/event-remind")
  public async sendEventStartReminders() {
    await this.appService.sendEventStartReminders();
  }
}
