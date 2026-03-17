import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { Event } from "../crawler/entity/event.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { WorkflowLog } from "./entity/workflow.log.entity";
import { MessageHistory } from "./entity/message.history.entity";
import { MessageReplyHistory } from "./entity/message.reply.history.entity";
import { EntityRepository } from "@mikro-orm/core";
import axios from "axios";

@Injectable()
export class WorkflowRunner {
  private readonly logger = new Logger(WorkflowRunner.name);

  private readonly axiosInstance = axios.create({
    baseURL: "https://toto9602.app.n8n.cloud/webhook",
  });

  constructor(
    @InjectRepository(WorkflowLog)
    private readonly workflowLogRepository: EntityRepository<WorkflowLog>,
    @InjectRepository(MessageHistory)
    private readonly messageHistoryRepository: EntityRepository<MessageHistory>,
    @InjectRepository(MessageReplyHistory)
    private readonly messageReplyHistoryRepository: EntityRepository<MessageReplyHistory>,
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    private readonly config: ConfigService,
  ) {}

  public async runReportEvents(events: Event[]) {
    if (events.length === 0) {
      this.logger.log(
        "신규 조회된 이벤트가 없어 workflow를 호출하지 않습니다...",
      );
      return;
    }

    try {
      events.forEach(async (it) => {
        const response = await this.axiosInstance.post(
          "/eb9070c7-f905-48b6-ae0f-6fdb39d86337",
          { ...it },
        );

        const eventIdList = events.map((it) => it.id);
        this.logger.log(
          "workflow 호출 완료, eventIdList " + eventIdList.join(","),
        );

        await this.workflowLogRepository
          .getEntityManager()
          .transactional(async (em) => {
            await em.persistAndFlush(
              WorkflowLog.of({
                response: response.data,
                eventIdList: events.map((it) => it.id),
              }),
            );
          });
      });
    } catch (e: any) {
      this.logger.error("Workflow 호출 중 오류 발생", e);
    }
  }

  public async runForEventsWithPeriods(): Promise<void> {
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
        const response = await this.axiosInstance.post(
          "/eb9070c7-f905-48b6-ae0f-6fdb39d86337",
          { ...event },
        );

        const messageId: string =
          response.data?.messageId ?? String(response.data?.id ?? "");

        await this.messageHistoryRepository
          .getEntityManager()
          .transactional(async (em) => {
            await em.persistAndFlush([
              MessageHistory.of({
                sentAt: new Date(),
                eventId: event.id,
                messageId,
              }),
              WorkflowLog.of({
                response: response.data,
                eventIdList: [event.id],
              }),
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

    const reminderWebhookPath = this.config.getOrThrow("REMINDER_WEBHOOK_PATH");

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
        const response = await this.axiosInstance.post(reminderWebhookPath, {
          messageId: history.externalMessageID,
          event: { ...event },
        });

        const replyMessageId: string =
          response.data?.messageId ?? String(response.data?.id ?? "");

        await this.messageReplyHistoryRepository
          .getEntityManager()
          .transactional(async (em) => {
            await em.persistAndFlush(
              MessageReplyHistory.of({
                sentAt: new Date(),
                eventId: event.id,
                originalMessageId: history.externalMessageID,
                replyMessageId,
              }),
            );
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
