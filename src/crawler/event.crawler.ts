import { Injectable, Logger } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";
import { EventHtmlParser } from "./event.html.parser";
import { EventDto } from "./dto/event.dtos";

@Injectable()
export class EventCrawler {
  private readonly logger = new Logger(EventCrawler.name);

  constructor(
    private readonly fetcher: EventHtmlFetcher,
    private readonly parser: EventHtmlParser,
  ) {}

  public async run(): Promise<EventDto[]> {
    const eventHtml = await this.fetcher.fetchEventsHTML();

    const parsedEvents = this.parser.parseEvents(eventHtml);

    const filtered = parsedEvents.filter((event) =>
      this.isWithinOneDay(event.date),
    );
    this.logger.log(`1일 이내 게시된 이벤트가 ${filtered.length} 건입니다`);

    return filtered;
  }

  private isWithinOneDay(dateRange: string): boolean {
    const [startDateStr] = dateRange.split(" ~ ");

    // 날짜 파싱 (YYYY-MM-DD 형식으로 변환)
    const startDate = new Date(`20${startDateStr.replace(/-/g, "-")}`);
    const today = new Date();

    // UTC 기준 날짜 차이 계산
    const diffInTime = Math.abs(today.getTime() - startDate.getTime());
    const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

    return diffInDays <= 1;
  }
}
