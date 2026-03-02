import { Controller, Get, Post } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Cron(CronExpression.EVERY_MINUTE)
  @Post("/new-events")
  public async fetchNewEvents() {
    await this.appService.fetchNewEvents();
  }

  // @Cron("*/10 * * * *") // :00, :10, :20 ...
  @Post("/event-detail-crawl")
  public async runEventDetailCrawl() {
    await this.appService.runEventDetailCrawl();
  }

  // @Cron("2-59/10 * * * *") // :02, :12, :22 ...
  @Post("/event-detail-parse")
  public async parseEventDetails() {
    await this.appService.parseEventDetails();
  }

  // @Cron("4-59/10 * * * *") // :04, :14, :24 ...
  @Post("/report-events")
  public async runReportEvents() {
    await this.appService.runReportEvents();
  }
}
