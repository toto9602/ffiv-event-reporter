import { Inject, Injectable, Logger } from "@nestjs/common";
import { Got } from "got";
import { DI_SYMBOLS } from "../common/constants/di-symbols";
import { Event } from "../crawler/entity/event.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { WorkflowLog } from "./entity/workflow.log.entity";
import { EntityRepository } from "@mikro-orm/core";

@Injectable()
export class WorkflowRunner {
  private readonly logger = new Logger(WorkflowRunner.name);

  constructor(
    @Inject(DI_SYMBOLS.WORKFLOW_HTTP_INSTANCE) private readonly http: Got,
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
      const responsePromises = events.map((event) =>
        this.http.post("", {
          json: event,
        }),
      );
      const responseList = await Promise.all(responsePromises);

      const eventIdList = events.map((it) => it.id);
      this.logger.log(
        "workflow 호출 완료, eventIdList " + eventIdList.join(","),
      );

      await this.workflowLogRepository
        .getEntityManager()
        .transactional(async (em) => {
          await em.persistAndFlush(
            WorkflowLog.of({
              response: JSON.parse(responseList[0].body),
              eventIdList: events.map((it) => it.id),
            }),
          );
        });
    } catch (e: any) {
      this.logger.error("Workflow 호출 중 오류 발생", e);
    }
  }
}
