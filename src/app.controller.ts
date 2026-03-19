import { Controller, Post } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 매분 00초: 신규 이벤트 크롤링
  @Cron("0 * * * * *")
  @Post("/fetch-new-events")
  public async fetchNewEvents() {
    await this.appService.fetchNewEvents();
  }

  // 매 5분 30초: 이벤트 기간 파싱 (fetchNewEvents와 충돌 방지를 위해 30초 오프셋)
  @Cron("30 */5 * * * *")
  @Post("/update-event-periods")
  public async updateEventPeriods() {
    await this.appService.updateEventPeriods();
  }

  // 매분 20초: 기간이 설정된 이벤트 알림 발송 (fetchNewEvents와 충돌 방지를 위해 20초 오프셋)
  @Cron("20 * * * * *")
  @Post("/report-new-events")
  public async runReportEventsWithPeriods() {
    await this.appService.reportNewEvents();
  }

  // 매일 00:00:10: 당일 시작 이벤트 리마인더 발송
  @Cron("10 0 0 * * *")
  @Post("/event-remind")
  public async sendEventStartReminders() {
    await this.appService.sendEventStartReminders();
  }
}
