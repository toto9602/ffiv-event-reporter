import { Injectable, Logger } from "@nestjs/common";
import { Event } from "../crawler/entity/event.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { WorkflowLog } from "./entity/workflow.log.entity";
import { CreateRequestContext, EntityRepository, MikroORM } from "@mikro-orm/core";
import axios from "axios";

@Injectable()
export class WorkflowRunner {
  private readonly logger = new Logger(WorkflowRunner.name);

  private readonly axiosInstanace = axios.create({
    baseURL: "https://toto9602.app.n8n.cloud/webhook",
  });

  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(WorkflowLog)
    private readonly workflowLogRepository: EntityRepository<WorkflowLog>,
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
  ) {}

  @CreateRequestContext()
  public async runReportEvents() {
    const events = await this.eventRepository.find({ notifiedAt: null });

    if (events.length === 0) {
      this.logger.log("미발송 이벤트가 없어 workflow를 호출하지 않습니다...");
      return;
    }

    this.logger.log(`미발송 이벤트 ${events.length}건 workflow 호출 시작`);

    for (const event of events) {
      try {
        const response = await this.axiosInstanace.post(
          "/eb9070c7-f905-48b6-ae0f-6fdb39d86337",
          { ...event },
        );

        await this.workflowLogRepository
          .getEntityManager()
          .transactional(async (em) => {
            await em.persistAndFlush(
              WorkflowLog.of({
                response: response.data,
                eventIdList: [event.id],
              }),
            );
            event.notifiedAt = new Date();
          });

        this.logger.log(`workflow 호출 완료, eventId: ${event.id}`);
      } catch (e: any) {
        this.logger.error(`workflow 호출 실패, eventId: ${event.id}`, e);
      }
    }
  }
}