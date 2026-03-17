import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  CreateRequestContext,
  EntityRepository,
  MikroORM,
} from "@mikro-orm/core";
import { DateParseStatus, Event } from "../crawler/entity/event.entity";
import { EventDetailRenderer } from "./renderer/event.detail.renderer";
import { EventDetailTextExtractor } from "./text-extractor/event.detail.text.extractor";
import { EventDateParser } from "./date-parser/date.parser.interface";
import { DI_SYMBOLS } from "../common/constants/di-symbols";

@Injectable()
export class EventDateUpdater {
  private readonly logger = new Logger(EventDateUpdater.name);

  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    private readonly renderer: EventDetailRenderer,
    private readonly textExtractor: EventDetailTextExtractor,
    @Inject(DI_SYMBOLS.EVENT_DATE_PARSER)
    private readonly dateParser: EventDateParser,
  ) {}

  @CreateRequestContext()
  public async run(): Promise<void> {
    const events = await this.eventRepository.find({
      eventStartedAt: null,
      eventEndedAt: null,
      dateParseStatus: DateParseStatus.NOT_PARSED,
    });

    this.logger.log(`날짜 업데이트 대상 이벤트 ${events.length}건`);

    for (const event of events) {
      try {
        const html = await this.renderer.render(event.detailLink);
        const text = this.textExtractor.extract(html);
        const parsed = await this.dateParser.parse(text);

        if (!parsed.eventStartedAt || !parsed.eventEndedAt) {
          this.logger.warn(
            `이벤트 [${event.title}]에서 날짜 정보를 파싱하지 못했습니다. 원본 날짜로 업데이트합니다.`,
          );
        }

        await this.eventRepository
          .getEntityManager()
          .transactional(async (em) => {
            if (parsed.eventStartedAt && parsed.eventEndedAt) {
              event.setParsedDates({
                eventStartedAt: parsed.eventStartedAt,
                eventEndedAt: parsed.eventEndedAt,
              });
            } else {
              event.setFallbackDates();
            }
            await em.persistAndFlush(event);
          });

        this.logger.log(
          `이벤트 [${event.title}] 날짜 업데이트: ${event.eventStartedAt} ~ ${event.eventEndedAt}`,
        );
      } catch (err) {
        this.logger.error(
          `이벤트 [${event.title}] 날짜 업데이트 중 오류 발생: ${err}`,
        );
        await this.eventRepository
          .getEntityManager()
          .transactional(async (em) => {
            event.setFallbackDates();
            await em.persistAndFlush(event);
          });
      }
    }

    await this.eventRepository.getEntityManager().flush();
    this.logger.log("날짜 업데이트 완료");
  }
}
