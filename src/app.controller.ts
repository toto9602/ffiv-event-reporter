import { Controller, Get } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  @Get()
  public async runEventWorklow() {
    await this.appService.runEventWorkflow();
  }

  public async updateEventPeriods() {
    await this.appService.updateEventPeriods();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async runReportEventsWithPeriods() {
    await this.appService.runReportEventsWithPeriods();
  }

  @Cron("0 0 * * *")
  public async sendEventStartReminders() {
    await this.appService.sendEventStartReminders();
  }
}
