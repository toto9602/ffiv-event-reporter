import { Injectable, Logger } from "@nestjs/common";
import { EventHtmlFetcher } from "./event.html.fetcher";
import { EventHtmlParser } from "./event.html.parser";
import { EventDto, FilterNewEventArgs } from "./dto/event.dtos";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Event } from "./entity/event.entity";
import {
  CreateRequestContext,
  EntityRepository,
  MikroORM,
  Property,
} from "@mikro-orm/core";

@Injectable()
export class EventCrawler {
  private readonly logger = new Logger(EventCrawler.name);

  constructor(
    private readonly fetcher: EventHtmlFetcher,
    private readonly parser: EventHtmlParser,
    private readonly orm: MikroORM,
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
  ) {}

  @CreateRequestContext()
  public async run(): Promise<Event[]> {
    const eventHtml = await this.fetcher.fetchEventsHTML();
    this.logger.log("HTML 조회 완료");
    const parsedEvents = this.parser.parseEvents(eventHtml);
    this.logger.log("Event 정보 파싱 완료" + `총 ${parsedEvents.length} 건`);

    const parsedEventTitles = parsedEvents.map((event) => event.title);
    const savedEvents = await this.eventRepository.find({
      title: { $in: parsedEventTitles },
    });

    const newEvents = this.filterNewEvents({ savedEvents, parsedEvents });

    this.logger.log(`신규 이벤트 ${newEvents.length} 건 조회하여, 저장합니다`);
    const newEventEntites = newEvents.map((event) =>
      Event.of({
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        summary: event.summary,
        detailLink: event.detailLink,
        bannerUrl: event.imageUrl,
      }),
    );

    return await this.eventRepository
      .getEntityManager()
      .transactional(async (em) => {
        await em.persistAndFlush(newEventEntites);
        return newEventEntites;
      });
  }

  private filterNewEvents({
    parsedEvents,
    savedEvents,
  }: FilterNewEventArgs): EventDto[] {
    const savedTitles = savedEvents.map((event) => event.title);

    return parsedEvents.filter((event) => !savedTitles.includes(event.title));
  }
}
