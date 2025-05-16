import { Inject, Injectable, Logger } from "@nestjs/common";
import { Got } from "got";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { Event } from "../crawler/entity/event.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { WorkflowLog } from "./entity/workflow.log.entity";
import { EntityRepository } from "@mikro-orm/core";
import axios from "axios";

@Injectable()
export class WorkflowRunner {
  private readonly logger = new Logger(WorkflowRunner.name);

  private readonly axiosInstanace = axios.create({
    baseURL: "https://toto9602.app.n8n.cloud/webhook",
  });

  constructor(
    @InjectRepository(WorkflowLog)
    private readonly workflowLogRepository: EntityRepository<WorkflowLog>,
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
        const response = await this.axiosInstanace.post(
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
}
