import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityRepository, MikroORM } from "@mikro-orm/core";
import { EventDetail } from "../crawler/entity/event.detail.entity";
import { EventDetailExtractor } from "./event.detail.extractor.interface";
import { DI_SYMBOLS } from "../common/constants/di-symbols";

@Injectable()
export class EventContentParser {
  private readonly logger = new Logger(EventContentParser.name);

  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(EventDetail)
    private readonly eventDetailRepository: EntityRepository<EventDetail>,
    @Inject(DI_SYMBOLS.EVENT_DETAIL_EXTRACTOR)
    private readonly llmExtractor: EventDetailExtractor,
  ) {}

  @CreateRequestContext()
  async parse(): Promise<void> {
    const pendingDetails = await this.eventDetailRepository.find({
      parsedAt: null,
    });
    this.logger.log(`파싱 대기 상세 ${pendingDetails.length}건 처리 시작`);

    for (const detail of pendingDetails) {
      try {
        const parsed = await this.llmExtractor.extract(detail.rawText);

        detail.eventStartedAt = parsed.eventStartedAt;
        detail.eventEndedAt = parsed.eventEndedAt;
        detail.featuredRewards = parsed.featuredRewards;
        detail.parsedAt = new Date();

        await this.eventDetailRepository.getEntityManager().flush();
        this.logger.log(`파싱 완료: eventDetailId ${detail.id}`);
      } catch (err) {
        this.logger.warn(`파싱 실패: eventDetailId ${detail.id} - ${err}`);
      }
    }
  }
}