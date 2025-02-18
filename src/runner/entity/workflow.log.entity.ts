import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../common/database/base.entity";

interface CreateWorkflowLogArgs {
  response: object;
  eventIdList: number[];
}

@Entity({ tableName: "workflow_logs" })
export class WorkflowLog extends BaseEntity {
  @Property({ type: "json" })
  response: object;

  @Property({ type: "json" })
  eventIdList: number[];

  public static of(args: CreateWorkflowLogArgs): WorkflowLog {
    const entity = new WorkflowLog();

    entity.response = args.response;
    entity.eventIdList = args.eventIdList;

    return entity;
  }
}
