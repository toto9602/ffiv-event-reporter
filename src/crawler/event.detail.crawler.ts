import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  CreateRequestContext,
  EntityRepository,
  MikroORM,
} from "@mikro-orm/core";
import { Event } from "./entity/event.entity";
import { EventDetail } from "./entity/event.detail.entity";
import { EventDetailRenderer } from "../renderer/event.detail.renderer";
import { EventDetailTextExtractor } from "../renderer/event.detail.text.extractor";

@Injectable()
export class EventDetailCrawler {
  private readonly logger = new Logger(EventDetailCrawler.name);

  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    @InjectRepository(EventDetail)
    private readonly eventDetailRepository: EntityRepository<EventDetail>,
    private readonly renderer: EventDetailRenderer,
    private readonly extractor: EventDetailTextExtractor,
  ) {}

  @CreateRequestContext()
  public async crawlEventDetails(): Promise<void> {
    const pendingEvents = await this.eventRepository.find({
      detailCrawledAt: null,
    });

    this.logger.log(`상세 미수집 이벤트 ${pendingEvents.length}건 처리 시작`);

    for (const event of pendingEvents) {
      try {
        const html = await this.renderer.render(event.detailLink);
        const rawText = await this.extractor.extract(html);

        const detail = EventDetail.of({ event, rawText });

        await this.eventDetailRepository
          .getEntityManager()
          .transactional(async (em) => {
            await em.persist(detail).flush();

            event.updateDetailCrawledAt(new Date());
            await em.persist(event).flush();
          });
        this.logger.log(`이벤트 상세 저장 완료: ${event.title}`);
      } catch (err) {
        this.logger.warn(`이벤트 상세 수집 실패: ${event.title} - ${err}`);
      }
    }
  }
}
