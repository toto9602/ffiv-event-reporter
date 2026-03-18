import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { Event } from "../crawler/entity/event.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { WorkflowLog } from "./entity/workflow.log.entity";
import { MessageHistory } from "./entity/message.history.entity";
import { MessageReplyHistory } from "./entity/message.reply.history.entity";
import { EntityRepository } from "@mikro-orm/core";
import { AxiosInstance } from "axios";

@Injectable()
export class WorkflowRunner {
  private readonly logger = new Logger(WorkflowRunner.name);

  private readonly newEventEndpoint: string;
  private readonly eventReplyEndpoint: string;

  constructor(
    @InjectRepository(MessageHistory)
    private readonly messageHistoryRepository: EntityRepository<MessageHistory>,
    @InjectRepository(MessageReplyHistory)
    private readonly messageReplyHistoryRepository: EntityRepository<MessageReplyHistory>,
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    private readonly config: ConfigService,
    @Inject(DI_SYMBOLS.WORKFLOW_HTTP_INSTANCE)
    private readonly axiosInstance: AxiosInstance,
  ) {
    this.newEventEndpoint = this.config.getOrThrow("NEW_EVENT_ENDPOINT");
    this.eventReplyEndpoint = this.config.getOrThrow("EVENT_REPLY_ENDPOINT");
  }

  public async reportNewEvents(): Promise<void> {
    const events = await this.eventRepository.find({
      eventStartedAt: { $ne: null },
      eventEndedAt: { $ne: null },
      deliveredAt: null,
    });

    if (events.length === 0) {
      this.logger.log("발송할 기간 설정 이벤트가 없습니다.");
      return;
    }

    for (const event of events) {
      try {
        const response = await this.axiosInstance.post(this.newEventEndpoint, {
          ...event,
        });

        const messageId: string =
          response.data?.messageId ?? String(response.data?.id ?? "");

        const now = new Date();
        await this.messageHistoryRepository
          .getEntityManager()
          .transactional(async (em) => {
            event.markAsDelivered(now);

            await em.persistAndFlush([
              MessageHistory.of({
                sentAt: now,
                eventId: event.id,
                messageId,
              }),
              WorkflowLog.of({
                response: response.data,
                eventIdList: [event.id],
              }),
              event,
            ]);
          });

        this.logger.log(
          `이벤트 ${event.id} 기간 알림 발송 완료, messageId: ${messageId}`,
        );
      } catch (e: any) {
        this.logger.error(`이벤트 ${event.id} 기간 알림 발송 중 오류 발생`, e);
      }
    }
  }

  public async sendEventStartReminders(): Promise<void> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const todayEvents = await this.eventRepository.find({
      eventStartedAt: { $gte: startOfDay, $lt: endOfDay },
    });

    if (todayEvents.length === 0) {
      this.logger.log("오늘 시작하는 이벤트가 없습니다.");
      return;
    }

    for (const event of todayEvents) {
      const history = await this.messageHistoryRepository.findOne({
        eventId: event.id,
      });

      if (!history) {
        this.logger.log(
          `이벤트 ${event.id}의 발송 이력이 없어 리마인더를 건너뜁니다.`,
        );
        continue;
      }

      try {
        const response = await this.axiosInstance.post(
          this.eventReplyEndpoint,
          {
            messageId: history.externalMessageID,
            event: { ...event },
          },
        );

        const replyMessageId: string =
          response.data?.messageId ?? String(response.data?.id ?? "");

        await this.messageReplyHistoryRepository
          .getEntityManager()
          .transactional(async (em) => {
            await em.persistAndFlush([
              MessageReplyHistory.of({
                sentAt: new Date(),
                eventId: event.id,
                originalMessageId: history.externalMessageID,
                replyMessageId,
              }),
              WorkflowLog.of({
                response: response.data,
                eventIdList: [event.id],
              }),
            ]);
          });

        this.logger.log(`이벤트 ${event.id} 시작 리마인더 발송 완료`);
      } catch (e: any) {
        this.logger.error(
          `이벤트 ${event.id} 시작 리마인더 발송 중 오류 발생`,
          e,
        );
      }
    }
  }
}
