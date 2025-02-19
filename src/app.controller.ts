import { Controller, Get } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  @Get()
  public async runEventWorklow() {
    await this.appService.runEventWorkflow();
  }
}
