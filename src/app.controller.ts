import { Controller, Get } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  @Get()
  public async fetchNewEvents() {
    await this.appService.fetchNewEvents();
  }

  @Cron("*/10 * * * *") // :00, :10, :20 ...
  public async runEventDetailCrawl() {
    await this.appService.runEventDetailCrawl();
  }

  @Cron("2-59/10 * * * *") // :02, :12, :22 ...
  public async parseEventDetails() {
    await this.appService.parseEventDetails();
  }

  @Cron("4-59/10 * * * *") // :04, :14, :24 ...
  public async runReportEvents() {
    await this.appService.runReportEvents();
  }
}